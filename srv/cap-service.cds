using {pokemons.db as db} from '../db/schema'; //cds watch

//@requires: 'authenticated-user'
service CapService {

    @cds.redirection.target

    @restrict: [
        {grant: 'READ', to: 'Viewer'},
        {grant: ['READ', 'CREATE', 'UPDATE', 'DELETE'], to: 'Admin'}
    ]
    entity Trainers             as
        select from db.Trainers {
            *,
            firstName || ' ' || lastName as Name : String
        };

    @restrict: [
        {grant: 'READ', to: 'Viewer'},
        {grant: ['READ', 'CREATE', 'UPDATE', 'DELETE'], to: 'Admin'}
    ]
    entity Teams                as projection on db.Teams
        actions {
            @restrict: [
                {grant: ['*'], to: 'Admin'}
            ]
            action   setTeamStatus(status: Boolean) returns String;

            @restrict: [
                {grant: ['*'], to: 'Admin'}
            ]
            function getRandomCapture()             returns Captures;

        /*{ // this does the same as the line above, putting it after the return
            ID          : UUID;
            PokemonName : String;
            Weight      : Integer;
            Height      : Integer;
            Team_ID     : UUID;
        };*/
        };

    @restrict: [
        {grant: 'READ', to: 'Viewer'},
        {grant: ['READ', 'CREATE', 'UPDATE', 'DELETE'], to: 'Admin'}
    ]
    entity Captures             as select from db.Captures;

    @restrict: [
        {grant: 'READ', to: 'Viewer'},
        {grant: ['READ', 'CREATE', 'UPDATE', 'DELETE'], to: 'Admin'}
    ]
    entity Medals               as projection on db.Medals;

    @restrict: [
        {grant: 'READ', to: 'Viewer'},
        {grant: ['READ', 'CREATE', 'UPDATE', 'DELETE'], to: 'Admin'}
    ]
    entity medalOwned           as
        projection on db.trainerMedals {
            *,
            trainerOwns.firstName,
            medalOwned.Name
        };

    @restrict: [
        {grant: 'READ', to: 'Viewer'},
        {grant: ['READ', 'CREATE', 'UPDATE', 'DELETE'], to: 'Admin'}
    ]
    entity Gyms                 as
        projection on db.Gyms {
            *,
            GymMedals.Name as MedalName
        };

    @restrict: [
        {grant: 'READ', to: 'Viewer'},
        {grant: ['READ', 'CREATE', 'UPDATE', 'DELETE'], to: 'Admin'}
    ]
    entity TrainerMedalCount    as
        select from Trainers as T
        left join db.trainerMedals as TM
            on TM.trainerOwns.ID = T.ID
        {
            key T.ID                    as TrainerID,
                T.firstName,
                T.lastName,
                count(TM.medalOwned.ID) as medalCount : String
        }
        group by
            T.ID,
            T.firstName,
            T.lastName;

    @restrict: [
        {grant: 'READ', to: 'Viewer'},
        {grant: ['READ', 'CREATE', 'UPDATE', 'DELETE'], to: 'Admin'}
    ]
    entity TrainerGymMedalsView as
        select from Trainers as T
        inner join TrainerMedalCount as MC
            on MC.TrainerID = T.ID
        left join db.trainerMedals as TM
            on TM.trainerOwns.ID = T.ID
        left join db.Medals as M
            on TM.medalOwned.ID = M.ID
        left join db.Gyms as G
            on G.GymMedals.ID = M.ID
        {

                T.firstName,
                T.lastName,
            key T.ID   as TrainerID,
                T.Email,
                T.BirthDate,

                M.Name as MedalName,

                // Using the previous view that provides the number of medals of each trainer
                MC.medalCount,

                G.GymName,
                G.GymLeader,
                G.Location
        }
        order by
            MC.medalCount desc;

    @restrict: [
        {grant: 'READ', to: 'Viewer'},
        {grant: ['READ', 'CREATE', 'UPDATE', 'DELETE'], to: 'Admin'}
    ]
    entity PokemonSizeView      as
        select from Captures {
            key ID,
                PokemonName,
                Team,
                Weight,
                case
                    when Weight < 20
                         then 'Small'
                    when Weight >= 20
                         and Weight <= 35
                         then 'Medium'
                    else 'Large'
                end as Size : String(10)
        };

    function getPokemonByName(name: String) returns LargeString; /*{ // this does the same as the line above, putting it after the return
            //ID          : UUID;
            PokemonName : String;
            Weight      : Integer;
            Height      : Integer;
            //Team_ID     : UUID;
        };
*/
};
