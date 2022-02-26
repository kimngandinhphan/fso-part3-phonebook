require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    Person.find({})
        .then(persons => {
            response.send(`
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date(Date.now())}</p>
            `)
        })

})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.send(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(deletedPerson => {
            if (deletedPerson) {
                response.statusMessage = 'successful delete'
                response.status(204).end()
            } else {
                response.status(400).end()
            }
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const { name, number } = request.body;

    if (!name || !number) {
        return response.status(400).json({ error: 'content missing' })
    }

    Person.find({ name }).then(persons => {
        if (!persons.length) {
            const person = new Person({
                name,
                number
            })

            person.save()
                .then(savedPerson => {
                    if (savedPerson) {
                        response.statusMessage = 'successful create'
                        response.json(savedPerson)
                    } else {
                        response.status(404).end()
                    }
                })
                .catch(error => next(error))
        } else {
            response.status(400).json({ error: 'name existed' })
        }
    })

})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body;
    Person.findByIdAndUpdate(request.params.id, { number }, { runValidators: true, new: true })
        .then(updatedPerson => {
            if (updatedPerson) {
                response.statusMessage = 'successful update'
                response.json(updatedPerson)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformed id' })
    }

    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})