const cds = require('@sap/cds')
const handlers = require('./handlers')

module.exports = cds.service.impl(async function (srv) { 
    //Trainers
    srv.before(['CREATE', 'UPDATE'], "Trainers", handlers.entities.trainers.validateTrainer);
    srv.after(['READ'], "Trainers", handlers.entities.trainers.uppercaseTrainerFirstName);
    //Teams
    srv.before(['CREATE', 'UPDATE'], "Teams", handlers.entities.teams.notRepeatedPokemonOnTeam);
    srv.before(['CREATE'], "Teams", handlers.entities.teams.defaultActiveOrInactiveTeam);
    srv.before(['DELETE'], "Teams", handlers.entities.teams.notDeleteTeams);
    //Captures
    srv.before(["DELETE"], "Captures", handlers.entities.captures.notDeleteLastCaptureOnActiveTeam);
})

