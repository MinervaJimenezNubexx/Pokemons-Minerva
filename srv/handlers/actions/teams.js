async function setTeamStatus(req) {
    const { status } = req.data
    teamId = req.params[0].ID  //req.params array that contains the entity bound to the action, only in bound actions

    await cds.db.run(
        UPDATE('pokemons.db.Teams')
            .set({ Active: status })
            .where({ ID: teamId })
    )

    return `Team status updated to ${status}`
}

async function addCapture(req) {
    const teamId = req.params[0].ID;
    const {pokemonId} = req.data;
    const pokemon = await cds.db.run(
        SELECT.one.from('pokemons.db.Pokemon').where({ID: pokemonId})
    );

    if (!pokemon) {
        return req.error(404, "The selected pokemon doesn't exist on the data base.");
    }

    const newCapture = {
        ID: cds.utils.uuid(),
        PokemonName: pokemon.name,
        Weight: pokemon.weight,
        Height: pokemon.height,
        Team_ID: teamId
    };

    await cds.db.run(
        INSERT.into('pokemons.db.Captures').entries(newCapture)
    );

    return newCapture;
}

module.exports = {
    setTeamStatus,
    addCapture
};