const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://admin:${password}@cluster0.2fdbomi.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)
const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(result => {
        console.log(`Added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    console.log('Phonebook:');
    Person.find({}).then(result => {
        result.forEach(p => {
          console.log(p.name+' '+p.number)
        })
        mongoose.connection.close()
      })
}