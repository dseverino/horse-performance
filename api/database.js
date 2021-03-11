const mongoose = require('mongoose')

mongoose.connect('mongodb://mongo/react-mongo-graphql', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false 
})
  .then(db => console.log('Db is connected to', db.connection.host))
  .catch(err => console.error(err))