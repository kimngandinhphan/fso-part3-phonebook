const personRouter = require('express').Router()
const Person = require('../models/person')


personRouter.get('/', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

personRouter.get('/info', (request, response) => {
    Person.find({})
        .then(persons => {
            response.send(`
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date(Date.now())}</p>
            `)
        })

})

personRouter.get('/:id', (request, response, next) => {
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

personRouter.delete('/:id', (request, response, next) => {
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

personRouter.post('/', (request, response, next) => {
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

personRouter.put('/:id', (request, response, next) => {
    const { number } = request.body;
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

module.exports = personRouter
