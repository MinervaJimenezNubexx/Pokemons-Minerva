async function getRandomPokemon(req) {

    const pokemons = await cds.db.run(
        SELECT.from('pokemons.db.Pokemon')
    )

    if(!pokemons.length){
        req.error(404, 'There are no Pokemons available.')
    }
    
    const random = Math.floor(Math.random() * pokemons.length)
    return pokemons[random]
}

module.exports = {
    getRandomPokemon
}