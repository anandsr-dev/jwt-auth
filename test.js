const { users } = require('./database')

const getUsers = () => console.log(users)

module.exports = { getUsers }