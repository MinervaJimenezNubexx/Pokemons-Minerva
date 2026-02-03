namespace pokemons_db;

using {cuid} from '@sap/cds/common';

// Voy a usar el mismo tipo en común para todos los nombres de las entidades
type Name : String(60);


entity Trainers : cuid {
    Name      : Name not null;
    Email     : String(120) not null;
    BirthDate : Date not null;

    // ENUNCIADO: Los Teams dependen del Trainer, de modo que si un entrenador se elimina, todos sus equipos también deben eliminarse ->
    // Como el Team depende del Trainer, para que el Team se borre si se borra el trainer se debe usar una relación fuerte
    // que en este caso es Composition, si fuera Association no se borrarían los teams sin trainers
    Teams     : Composition of many Teams
                    on Teams.TeamTrainer = ID;

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
                      on Captures.Team = ID;
}

entity Captures : cuid {
    PokemonName : Name not null;
    Weight      : Int16 not null;
    Height      : Int16 not null;
    // ENUNCIADO: Cada Capture pertenece a un único Team ->
    // Lo mismo, se requiere una asociación de tipo to-many
    Team        : Association to Teams;
}

// Como Teams depende de Trainers y Captures depende de Teams, se crea un borrado en cascada de los datos en caso de borrar un trainer