const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    unique: true
  },
  confirmpassword: {
    type: String,
    unique: true
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  date: {
    type: Date,
    default: Date.now
  }
  // googleId: { type: String }
})

// Generating tokens
userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY)
    this.tokens = this.tokens.concat({ token: token })
    await this.save()
    console.log(token)
    return token
  } catch (e) {
    // res.send('the error part' + e)
    console.log('The error part' + e)
  }
}

// Converting password into hash
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
    this.confirmpassword = await bcrypt.hash(this.password, 10)
  }
  next()
})

// User Model
const User = mongoose.model('User', userSchema)

module.exports = User
