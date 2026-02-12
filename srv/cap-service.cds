using {pokemons.db as db} from '../db/schema'; //cds watch

service CapService {


    entity Trainers             as
        select from db.Trainers {
            *,
            firstName || ' ' || lastName as Name : String
        };

    entity Teams                as projection on db.Teams;

    entity Captures             as select from db.Captures;

    entity Medals               as projection on db.Medals;

    entity medalOwned           as
        projection on db.trainerMedals {
            *,
            trainerOwns.firstName,
            medalOwned.Name
        };

    entity Gyms                 as
        projection on db.Gyms {
            *,
            GymMedals.Name as MedalName
        };

    entity TrainerMedalCount    as
        select from Trainers as T
        left join db.trainerMedals as TM
            on TM.trainerOwns.ID = T.ID
        {
            T.ID                    as TrainerID,
            T.firstName,
            T.lastName,
            count(TM.medalOwned.ID) as medalCount
        }
        group by
            T.ID,
            T.firstName,
            T.lastName;

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
            T.ID   as TrainerID,
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

    entity PokemonSizeView      as
        select from Captures {
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

        //action changeTeamStatus
};
