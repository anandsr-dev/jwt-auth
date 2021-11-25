const User = require('../models/users.js')
const Token = require('../models/tokens.js')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.userList = async (req, res) => {
    const users = await User.find({}).exec()
    res.send(users)
}

exports.signup = async (req, res) => {
    // User Authentication
    try {
        const hash = await bcrypt.hash(req.body.password, 10)
        const user = { name: req.body.name, password: hash }
        await new User(user).save()
        res.status(201).send('Created')

    } catch (error) {
        res.status(500).send(error.message)
    }

}

exports.login = async (req, res) => {

    const user = await User.findOne({ name: req.body.name }).lean().exec()
    if (user) {

        try {

            if (await bcrypt.compare(req.body.password, user.password)) {

                const accessToken = generateAccessToken({ name: user.name })
                const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_KEY)
                await new Token({ token: refreshToken }).save()
                res.json({ accessToken, refreshToken })

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
}

exports.validateToken = async (req, res) => {
    const refreshToken = req.body.token
    if (!refreshToken) return res.sendStatus(401)

    const token = Token.findOne({ token: refreshToken })
    if (!token) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user.name })

        res.json({ accessToken })
    })



}

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_KEY, { expiresIn: '35s' })
}