const logger = require('./logger')

const unknownEndpoint = (req, res) => res.status(404).json({ error: 'unknown endpoint' })

const errorHandler = (error, req, res, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformed id' })
    }

    if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

module.exports = { unknownEndpoint, errorHandler }