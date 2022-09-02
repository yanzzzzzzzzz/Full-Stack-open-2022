const mongoose = require('mongoose')
console.log('len:',process.argv.length)
if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
console.log('pd:',password)
const url =`mongodb+srv://fullstack:${password}@cluster0.pm9okyd.mongodb.net/test?retryWrites=true&w=majority`
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

Note.find({ content: 'HTML is Easy' }).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})