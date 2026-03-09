//SELECT * FROM Trainers -> SELECT * FROM Trainers WHERE Email = 'userEmail' when rol is Trainer
async function restrictTrainerRead(req) {
    if (req.user.is('Trainer')) {
        const userEmail = req.user.id;
        req.query.where({ Email: userEmail });   
    }
}

module.exports = {
    restrictTrainerRead
}