const express = require('express');
const app = express();
var morgan = require('morgan');
const cors = require("cors");
morgan.token('type', function (req, res) { return JSON.stringify(req.body) });
const morganType = ':method :url :status :res[content-length] :response-time ms :type'

app.use(morgan(morganType));
app.use(express.json());
app.use(cors());
app.use(express.static('build'))
let persons = 
[
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has ${persons.length} info for people</p>${new Date()}`)
})

app.get('/api/persons/:id',(request, response) =>{
    const id = Number(request.params.id)
    const person = persons.find(person=>person.id === id)

    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    persons = persons.filter(person=>person.id !== id)

    response.status(204).end()
})

const generateId = () =>{
    const maxId = persons.length > 0
    ? Math.max(...persons.map(n=>n.id))
    : 0
    return maxId + 1
}

app.post('/api/persons',(request, response)=>{
    const body = request.body
    console.log(body)

    if(persons.find(person=>person.name === body.name)){
        return response.status(400).json({
            error:'name must be unique'
        })
    }
    
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    }
    persons = persons.concat(person)

    response.json(person)
})

app.put('/api/persons/:id', (request, response, next)=>{
  const {name, number} = request.body;

});
const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)