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

module.exports = {
    getPokemonByName
}