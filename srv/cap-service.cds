using {pokemons.db as db} from '../db/schema'; //cds watch

service CapService {

    entity Trainers   as
        select from db.Trainers {
            *,
            firstName || ' ' || lastName as Name : String
        };

    entity Teams      as projection on db.Teams;

    entity Captures   as projection on db.Captures;

    entity Medals     as projection on db.Medals;

    entity medalOwned as
        projection on db.medalsOwned {
            *,
            trainerOwns.firstName,
            medalOwned.Name
        }
};
