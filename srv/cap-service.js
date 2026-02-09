const cds = require('@sap/cds')

module.exports = cds.service.impl(async function TrainerEmailFormat(params) {
    const { Trainers } = this.entities

    this.before(['CREATE', 'UPDATE'], Trainers, (req) => {
        const email = req.data.Email

        if (!email) return // if there is no email, do nothing
        const emailFormat = /^[A-Za-z0-9._]+@nubexx\.(es|com)$/
        if (!emailFormat.test(email)) {
            req.error(400, 'Invalid email format.')
        }
    })
})

module.exports = cds.service.impl(async function ValidTrainerAge(params) {
    const { Trainers } = this.entities

    this.before(['CREATE', 'UPDATE'], Trainers, (req) => {
        const birthDate = req.data.BirthDate

        if (!birthDate) return // if there is no birthdate, do nothing

        const today = new Date()
        const birth = new Date(birthDate) // copy of the birthdate to have it as a Date type, birthDate is not considered a Date type
        // so the method .getFullYear won't work on it when the code is executed

        let age = today.getFullYear() - birth.getFullYear()

        const hasHadBirthdayThisYear =
            (today.getMonth() > birth.getMonth()) ||
            (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate())

        if (!hasHadBirthdayThisYear) { //if they have not had their birthday this year yet, 
            // their age is one less, not the exact one calculated before
            age--
        }

        if (age < 18 || age > 110) {
            req.error(400, 'The trainer must be over 18 and under 110 years old.')
        }
    })
})

module.exports = cds.service.impl(async function NotRepeatedPokemonOnTeam(params) {
    const { Captures } = this.entities

    this.before(['CREATE', 'UPDATE'], Captures, async (req) => {
        const PokemonName = req.data
        const Team = req.data

        if (!PokemonName || !Team) return // if there is no data, do nothing

        const existing = await cds.run(
            SELECT.one.from(Captures).where({
                PokemonName,
                Team_ID: Team.ID  // equivalent to WHERE Team_ID = 'ID' in SQL
            })
        )

        if (existing && existing.ID !== req.data.ID) { // check that the coincidence is not on the same pokemon we are trying to update
            req.error(400,`"${PokemonName}" is already in this team.`)
        }

    })
})

module.exports = cds.service.impl(async function NotDeleteTeams(params) {
    const { Teams } = this.entities

    this.before(['DELETE'], Teams, async (req) => {
        const Team = req.data.Name
        

    })
})