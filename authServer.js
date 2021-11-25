require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

app.use(express.json())

const { userList, signup, login, validateToken } = require('./controllers/user')

app.get('/users', userList)

app.post('/users', signup)

app.post('/login', login)

app.post('/token', validateToken)

const start = async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
            console.log('Connected to database')
            app.listen(4000, () => console.log('Server running at port 4000'))
        })
}

start()

