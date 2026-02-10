function trainerEmailFormat(req) {

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

}

module.exports = {trainerEmailFormat}
/*
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
*/

