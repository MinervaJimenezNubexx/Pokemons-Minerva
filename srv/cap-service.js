const cds = require('@sap/cds')

module.exports = cds.service.impl(function TrainerEmailFormat(params) {
    const { Trainers } = this.entities

    this.before(['CREATE', 'UPDATE'], Trainers, (req) => {
        const email = req.data.Email

        if (!email) return // if there is no email, do nothing

        // the / / delimitates the pattern, the ^ marks where it starts and the $ marks where it ends
        // the simbols inside []+ means that there has to be one or more of them, the things outside [] means it has to be exactly
        // like that, the \. is to use the literal '.', because using just . means 'anything goes here'
        // finally, the (x|y) means that you have to use either x or y 
        const emailFormat = /^[A-Za-z0-9._]+@nubexx\.(es|com)$/ // really alike to the way we fixed patterns in automata

        if (!emailFormat.test(email)) { // method definition: Returns a Boolean value that indicates whether or not a pattern exists 
        // in a searched string
            req.error(400, 'Invalid email format.') // error 400 -> bad request, generic
        }
    })
})

module.exports = cds.service.impl(function ValidTrainerAge(params) {
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

        // we can't use views here to get data, so we use this fuctions (.from, .where,...) to simulate a view, saving the data into a 
        // variable that we will use for the condition
        const existing = await cds.run(
            SELECT.one.from(Captures).where({
                PokemonName,
                Team_ID: Team.ID  // equivalent to WHERE Team_ID = 'ID' in SQL
            })
        )

        if (existing && existing.ID !== req.data.ID) { // check that the coincidence is not on the same pokemon we are trying to update
            req.error(400, `"${PokemonName}" is already in this team.`)
        }
    })
})

module.exports = cds.service.impl(function NotDeleteTeams(params) {
    const { Teams } = this.entities

    this.before(['DELETE'], Teams, (req) => {

        req.reject(403, 'Teams cannot be deleted once created.') // error 403 -> forbidden action, using reject because error 
        // doesn't cancel the delete
    })
})

module.exports = cds.service.impl(async function ActiveOrInactiveTeam(params) {
    const { Teams, Captures } = this.entities

    this.after('DELETE', Captures, async (data, req) => {
        const teamId = data.Team_ID

        if (!teamId) return // if there is no data, do nothing

        const tx = cds.tx(req) // Capire:  the constructed transaction will use this context as it's tx.context

        // counting the pokemons left on the team we deleted a pokemon from
        // can't use a view here because views are not linked to the transaction and can't do a rollback on the operation if needed
        // so we put the data inside of a variable using the context
        const [{ count }] = await tx.run(
            SELECT.from(Captures)
                .where({ Team_ID: teamId })
                .columns([{ func: 'count', as: 'count' }])
        )

        if (count > 0) return // if there are pokemons left after deleting this one, we do nothing

        const team = await tx.run(
            SELECT.one.from(Teams).where({ ID: teamId })
        )

        // if the team exists and is active. I think it can also be coded as (team?.Active), which is from JS, it does the same
        if (team && team.Active) {
            req.reject(400, 'Deletion cancelled: An active team cannot be left without pokemons.') // req.reject cancels the operations 
            // and also makes a rollback, which returns the deleted pokemon to the database
        }
        // if the team doesn't exist or is not active it does nothing
    })
})


module.exports = cds.service.impl(function DefaultActiveOrInactiveTeam(params) {
    const { Teams } = this.entities

    this.before('CREATE', Teams, req => {
        const captures = req.data.Captures

        if (captures && captures.length > 0) { // if it exists and has pokemons
            req.data.Active = true
        } else {
            req.data.Active = false
        }
    })
})

module.exports = cds.service.impl(function UppercaseTrainerFirstName() {
    const { Trainers } = this.entities

    this.after('READ', Trainers, data => {

        if (!data) return // if there is no data, do nothing

        let trainers

        // if I read one single record, its an object, but if I read multiple records, its an array of objects
        // so if its a single object, I put it into an array to work with the same type of data
        if (Array.isArray(data)) {
            trainers = data
        } else {
            trainers = [data]
        }

        for (const trainer of trainers) { // foreach in JS
            if (trainer.firstName) { // if the trainer has firstname
                trainer.firstName = trainer.firstName.toUpperCase()
            }
        }
    })
})

