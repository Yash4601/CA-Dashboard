const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/ambassadorDB', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => {
  console.log('Connection Successful')
}).catch((e) => {
  console.log('No connection')
})
