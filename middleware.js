require('dotenv').config()

const jwt = require('jsonwebtoken')

const userAuth = (req, res, next) => {

    authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) return res.sendStatus(403)

    jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, user) => {
        if(err) return res.sendStatus(403)

        req.user = user
        next()
    })

}

module.exports = { userAuth }