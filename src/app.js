require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const auth = require('./middleware/auth')
const app = express()
// const GoogleStrategy = require('passport-google-oauth20').Strategy
// const findOrCreate = require('mongoose-findorcreate')
const PORT = process.env.PORT || 3000

require('./db/connectDB')
const User = require('./models/registered-users')

app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

// login page route
app.get('/login', function (req, res) {
  res.render('login')
})

app.get('/forgot_password', function (req, res) {
  res.render('forgot_password')
})

app.get('/register', function (req, res) {
  res.render('register')
})

app.get('/dashboard', auth, function (req, res) {
  res.render('dashboard')
})

app.get('/homepage', auth, function (req, res) {
  res.render('homepage')
})

app.get('/profile', auth, function (req, res) {
  res.render('profile')
})
// register post route - New User Registration
app.post('/register', async (req, res) => {
  try {
    const password = req.body.password
    const cpassword = req.body.confirmpassword

    if (password === cpassword) {
      const registeredUsers = new User({
        name: req.body.name,
        email: req.body.email,
        password: password,
        confirmpassword: cpassword
      })

      console.log('The success part: ' + registeredUsers)

      const token = await registeredUsers.generateAuthToken()
      console.log('The token part: ' + token)

      // The res.cookie() function is used to set the cookie name to value.
      res.cookie('jwt', token, {
        expires: new Date(Date.now() + 60000),
        httpOnly: true
      })

      const registered = await registeredUsers.save()
      console.log('The page part: ' + registered)

      res.status(201).redirect('dashboard')
    } else {
      res.send('Invalid login details')
    }
  } catch (e) {
    res.status(400).console.log(e)
    console.log('The error part page')
  }
})

// login post route - User Login
app.post('/login', async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password

    const userEmail = await User.findOne({ email: email })

    const doesPasswordMatch = await bcrypt.compare(password, userEmail.password)

    const token = await userEmail.generateAuthToken()
    console.log('The token part: ' + token)

    res.cookie('jwt', token, {
      expires: new Date(Date.now() + 600000),
      httpOnly: true
      // secure: true
    })

    if (doesPasswordMatch) {
      res.status(201).redirect('dashboard')
    } else {
      res.send('Invalid login details')
    }
  } catch (e) {
    res.status(400).send('Invalid login details')
  }
  // const email = req.body.email
  // const password = req.body.password
  //
  // User.findOne({ email: email }, function (err, foundUser) {
  //   if (err) {
  //     console.log(err)
  //   } else {
  //     if (foundUser) {
  //       if (foundUser.password === password) {
  //         res.status(201).render('home')
  //       }
  //     }
  //   }
  // })
})

app.listen(PORT, function () {
  console.log(`Server has started Successfully on port ${PORT}`)
})
