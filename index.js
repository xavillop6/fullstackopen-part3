const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

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

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
    },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
    },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
    },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
    }
]


app.get('/info', (request, response) => {
  let num = persons.length;

  const currentDate = new Date();
  
  response.send(`
    <p>Phonebook has info for ${num} people</p>
    <p>${currentDate}</p>
    `)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = request.body;

  if (!person || !person.name || !person.number) {
    return response.status(400).json({error: 'The name or number is missing'}).end()
  }

  const duplicatePerson = persons.find(p => p.name === person.name)
  if (duplicatePerson) {
    return response.status(400).json({error: 'Name must be unique'}).end()
  }
  const min = 1;
  const max = 100000;

  const newPerson = {
    name: person.name,
    number: person.number,
    id: Math.floor(Math.random() * (max - min)) + min,
  }
  persons = persons.concat(newPerson);

  response.status(201).json(newPerson)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})