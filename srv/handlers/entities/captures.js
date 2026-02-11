async function notDeleteLastCaptureOnActiveTeam(req) {

    const tx = cds.tx(req) // Capire:  the constructed transaction will use this context as it's tx.context

    const capture = await tx.run(
        SELECT.one.from('pokemons.db.Captures')
            .where({ ID: req.data.ID })
    )

    if (!capture || !capture.Team_ID) return //if there is no data, do nothing

    const teamId = capture.Team_ID

    // counting the pokemons left on the team we deleted a pokemon from
    // can't use a view here because views are not linked to the transaction and can't do a rollback on the operation if needed
    // so we put the data inside of a variable using the context
    const [{ count }] = await tx.run(
        SELECT.from('pokemons.db.Captures')
            .where({ Team_ID: teamId })
            .columns([{ func: 'count', as: 'count' }])
    )

    if (count > 1) return // if there are pokemons left after deleting this one, we do nothing

    const team = await tx.run( // if this is the last one, check the Active state of the team
        SELECT.one.from('pokemons.db.Teams')
            .where({ ID: teamId })
    )

    // if the team exists and is active. I think it can also be coded as (team?.Active), which is from JS, it does the same
    if (team && team.Active) {
        req.reject(400, 'Deletion cancelled: An active team cannot be left without pokemons.') // req.reject cancels the operations 
        // and also makes a rollback, which returns the deleted pokemon to the database
    }
    // if the team doesn't exist or is not active it does nothing

}

module.exports = {
    notDeleteLastCaptureOnActiveTeam
};