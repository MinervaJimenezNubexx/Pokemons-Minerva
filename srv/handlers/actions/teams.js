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

module.exports = {
    setTeamStatus
};