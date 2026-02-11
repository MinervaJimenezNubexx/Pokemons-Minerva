function notRepeatedPokemonOnTeam(req) {

    const team = req.data
    if (!team || !team.Captures) return

    const alreadyOnTeam = new Set() // elements cannot be duplicated on sets

    for (const capture of team.Captures) {
        if (!capture.PokemonName) continue

        if (alreadyOnTeam.has(capture.PokemonName)) {
            req.error(
                400,
                `Pokemon "${capture.PokemonName}" is duplicated in team "${team.Name}"`
            )
        }

        alreadyOnTeam.add(capture.PokemonName) // I add the pokemons to the set, if the same one is tried to be added, error
    }
}

function notDeleteTeams(req) {

    req.reject(403, 'Teams cannot be deleted once created.') // error 403 -> forbidden action, using reject because error 
    // doesn't cancel the delete

}

function defaultActiveOrInactiveTeam(req) {
    const captures = req.data.Captures

    if (captures && captures.length > 0) { // if it exists and has pokemons
        req.data.Active = true
    } else {
        req.data.Active = false
    }

}

module.exports = {
    notRepeatedPokemonOnTeam,
    notDeleteTeams,
    defaultActiveOrInactiveTeam
};