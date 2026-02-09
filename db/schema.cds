namespace pokemons.db; //namespaces are named using . instead of _, the mock data file must be named using this format: pokemons.db-Captures.csv

using {cuid} from '@sap/cds/common';

type Name        : String(60);

type GeoLocation : {
    latitude  : Decimal(9, 6);
    longitude : Decimal(9, 6);
    region    : Name not null
};

@assert.unique: {Email: [Email]}

entity Trainers : cuid {
    firstName   : Name not null;
    lastName    : Name not null;
    name : String = (firstName || ' ' || lastName);
    // si no le pongo nada no se guarda el dato en bbdd, si pongo stored al final se guardaría: name : String = (firstName || ' ' || lastName) stored;
    Email       : String(121) not null;
    BirthDate   : Date not null; // formato año-mes-día

    // ENUNCIADO: Los Teams dependen del Trainer, de modo que si un entrenador se elimina, todos sus equipos también deben eliminarse ->
    // Como el Team depende del Trainer, para que el Team se borre si se borra el trainer se debe usar una relación fuerte
    // que en este caso es Composition, si fuera Association no se borrarían los teams sin trainers
    Teams       : Composition of many Teams
                      on Teams.TeamTrainer = $self; // el formato de las UUID es largo con muchos digitos, mejor buscar un generador de UUID para no hacerlo a mano

    MedalsOwned : Composition of many trainerMedals
                      on MedalsOwned.trainerOwns = $self;
}

entity Medals : cuid {
    Name          : Name not null;
    Owners        : Composition of many trainerMedals
                        on Owners.medalOwned = $self;
    Gyms          : Composition of Gyms
                        on Gyms.GymMedals = $self;
    canBeObtained : Boolean default true;
}

@assert.unique: {GymName: [GymName]}
@assert.unique: {Location: [Location]}
entity Gyms : cuid {
    GymName   : Name not null;
    GymMedals : Association to Medals;
    GymLeader : Name not null;
    Location  : GeoLocation not null;
}

// table on the middle to create the n:n relation

//@assert.unique: {obtainedAgainst: [obtainedAgainst]}

entity trainerMedals {
    key trainerOwns     : Association to Trainers not null;
    key medalOwned      : Association to Medals not null;
        obtainedOn      : Date not null; // date on which the medal was obtained
        obtainedAgainst : Name not null; // leader of the gym defeated to obtain the medal
}


entity Teams : cuid {
    Name        : Name not null;
    Description : String(255) not null;
    Active      : Boolean default true;
    // ENUNCIADO: Cada Team pertenece a un único Trainer ->
    // Association to -> el team solo está asociado a un único trainer, asociación de tipo to-many (1:n)
    // Si pudiera tener más trainers sería una asociación many-to-many (n:n), y haría falta una tabla intermedia con dos atributos
    // correspondientes a las PK de las dos tablas a asociar, igual que en SQL
    TeamTrainer : Association to Trainers;
    // ENUNCIADO: Las Captures dependen del Team, por lo que si un equipo se elimina, sus capturas también deben eliminarse ->
    // Aquí pasa lo mismo que en el caso anterior, por lo que se usa Composition de nuevo
    Captures    : Composition of many Captures
                      on Captures.Team = $self; // si pongo ID me da error en el cds watch
}

entity Captures : cuid {
    PokemonName : Name not null;
    Weight      : Int16 not null;
    Height      : Int16 not null;
    // ENUNCIADO: Cada Capture pertenece a un único Team ->
    // Lo mismo, se requiere una asociación de tipo to-many
    Team        : Association to Teams;
}
// Since Captures depends on Teams, and Teams on Trainers, it creates Delete on Cascade

// The views can be done here in the schema.cds or in the service.cds



