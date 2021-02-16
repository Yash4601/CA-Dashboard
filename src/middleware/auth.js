const jwt = require('jsonwebtoken')
const Register = require('../models/registered-users')

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY)
    console.log(verifyUser)

    const user = await Register.findOne({ _id: verifyUser._id })
    console.log(user)
    next()
  } catch (e) {
    res.status(401).send(e)
  }
}

module.exports = auth
