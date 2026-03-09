const cds = require('@sap/cds')
const handlers = require('./handlers')

module.exports = cds.service.impl(async function (srv) {

    /*
        ENTITIES
    */

    //Trainers
    srv.before(['CREATE', 'UPDATE'], "Trainers", handlers.entities.trainers.validateTrainer);

    srv.before(['READ'], "Trainers", handlers.functions.trainers.restrictTrainerRead);

    srv.after(['READ'], "Trainers", handlers.entities.trainers.uppercaseTrainerFirstName);

    //Teams
    srv.before(['CREATE', 'UPDATE'], "Teams", handlers.entities.teams.notRepeatedPokemonOnTeam);

    srv.before(['CREATE'], "Teams", handlers.entities.teams.defaultActiveOrInactiveTeam);

    srv.before(['DELETE'], "Teams", handlers.entities.teams.notDeleteTeams);

    //Captures
    srv.before(["DELETE"], "Captures", handlers.entities.captures.notDeleteLastCaptureOnActiveTeam);

    /*
        ACTIONS
    */

    //Teams
    srv.on("setTeamStatus", handlers.actions.teams.setTeamStatus);
    srv.on("addCapture", handlers.actions.teams.addCapture);

    /*
        FUNCTIONS
    */

    //Teams
    srv.on("getRandomCapture", handlers.functions.teams.getRandomCapture);

    //Pokemon
    srv.on("getRandomPokemon", handlers.functions.pokemon.getRandomPokemon);

    //Roles
    srv.on("getUserPermissions", handlers.functions.roles.getUserPermissions);

    /*
        EXTERNALS
    */

    //PokeAPI
    srv.on("getPokemonByName", handlers.externals.pokeapi.getPokemonByName);
    srv.on("importPokemon", handlers.externals.pokeapi.importPokemon);

})

