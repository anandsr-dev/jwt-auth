require('dotenv').config()

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(express.json())

const { users } = require('./database')
const { posts } = require('./database')
// const { getUsers } = require('./test')

app.get('/users', (req, res) => {
    res.send(users)
})

app.post('/users', async (req, res) => {
    // User Authentication
    try {
        const hash = await bcrypt.hash(req.body.password, 10)
        const user = { name: req.body.name, password: hash }
        users.push(user)
        res.status(201).send('Created')

    } catch (error) {
        res.status(500).send(error.message)
    }

})

app.post('/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name)

    if (user) {

        try {

            if (await bcrypt.compare(req.body.password, user.password)) {
               const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_KEY) 
               res.json({accessToken})
            }

            else {
                res.send('Wrong password')
            }
        } catch (error) {
            res.status(500).send(error.message)
        }

    }
    else {
        res.status(401).send('Invalid user')
    }
})

app.get('/posts', (req, res) => {
    res.json(posts)
})

app.listen(3000)