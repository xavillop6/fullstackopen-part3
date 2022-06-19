require('dotenv').config()
require('./mongo-connection');

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const Person = require('./models/Person');

app.use(cors())
app.use(express.static('build'))
app.use(express.json())


app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))


app.get('/info', (request, response) => {
  let num = persons.length;

  const currentDate = new Date();
  
  response.send(`
    <p>Phonebook has info for ${num} people</p>
    <p>${currentDate}</p>
    `)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const { id } = request.params;
  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const { id } = request.params;
  Person.findByIdAndRemove(id).then(result => {
      response.status(204).end()
  });
})

app.post('/api/persons', (request, response) => {
  const person = request.body;

  if (!person || !person.name || !person.number) {
    return response.status(400).json({error: 'The name or number is missing'}).end()
  }

  //const duplicatePerson = persons.find(p => p.name === person.name)
  /*if (duplicatePerson) {
    return response.status(400).json({error: 'Name must be unique'}).end()
  }*/

  const newPerson = new Person({
    name: person.name,
    number: person.number
  })

  newPerson.save().then(savedPerson => {
    console.log(savedPerson);
    response.status(201).json(savedPerson)
  })

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})