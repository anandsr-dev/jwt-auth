const mongoose = require('mongoose')

const tokenSchema = mongoose.Schema({
    token: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('Token', tokenSchema)