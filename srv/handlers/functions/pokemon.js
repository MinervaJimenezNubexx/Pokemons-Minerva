const {importPokemon} = require('../externals/pokeapi');

async function getRandomPokemon(req) {
    let pokemons = await cds.db.run(SELECT.from('pokemons.db.Pokemon'));

    if (!pokemons || pokemons.length === 0) {
        // if there are no pokemons on the database, we call the import function
        await importPokemon(req); 
        pokemons = await cds.db.run(SELECT.from('pokemons.db.Pokemon'));
    }

    const random = Math.floor(Math.random() * pokemons.length);
    return pokemons[random];
}

module.exports = {
    getRandomPokemon
}