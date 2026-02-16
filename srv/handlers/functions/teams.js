async function getRandomCapture(req) {
    const [{ ID: teamId }] = req.params //const teamId = req.params[0].ID

    const captures = await cds.db.run(
        SELECT.from('pokemons.db.Captures')
            .where({Team_ID: teamId})
    )

    if(!captures.length){
        req.error(404, 'The selected team has no captures.')
    }
    
    const random = Math.floor(Math.random() * captures.length)
    return captures[random]
}

module.exports = {
    getRandomCapture
}