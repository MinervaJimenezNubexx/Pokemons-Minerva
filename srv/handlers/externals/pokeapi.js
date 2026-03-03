async function getPokemonByName(req) {
    const { name } = req.data

    if (!name) {
        req.error(400, 'Pokemon name is required')
    }

    const pokemonName = name.toLowerCase()

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)

    if (!res.ok) {
        throw new Error(`Pokemon "${pokemonName}" not found in PokeAPI`)
    }

    return res

}

async function importPokemon(req) {
        //const pokemonName=req.data.pokemonName;
        const pokeApi= await cds.connect.to('PokeAPIDestination');
        const response = await pokeApi.send('GET', `/pokemon/?limit=151`);
        var details;
     const pokemonData = [];

        for (const poke of response.results) {
            // const { data } = await axios.get(poke.url);
            details = await pokeApi.send('GET', `/pokemon/${poke.name}`);
            pokemonData.push({
                ID: cds.utils.uuid(),
                name: poke.name,
                number: details.id,
                height: details.height,
                weight: details.weight
            });
        }

        // Limpiar e insertar
        await cds.db.run(DELETE.from('pokemons.db.Pokemon'));
        await cds.db.run(INSERT.into('pokemons.db.Pokemon').entries(pokemonData));

        return "Done."
}

module.exports = {
    getPokemonByName,
    importPokemon
}