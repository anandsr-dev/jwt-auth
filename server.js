require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

app.use(express.json())

const { posts } = require('./database')
const { userAuth } = require('./middleware')
// const { getUsers } = require('./test')

app.get('/posts', userAuth, (req, res) => {
    const post = posts.filter(post => req.user.name === post.username)
    if (post.length > 0)
        res.json(post)
    else
        res.json(posts)
})

const start = async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
            console.log('Connected to database')
            app.listen(3000, () => console.log('Server running at port 3000'))
        })
}

start()


