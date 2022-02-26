const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)
    .then(() => { console.log('Database connected!'); })
    .catch(error => console.log(error))

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: [true, 'Person name required'],
    },
    number: {
        type: String,
        validate: {
            validator: v => /-/.test(v) ? /^(\d{2}|\d{3})-\d+$/.test(v) : true,
            message: props => `${props.value} is not a valid phone number!`
        },
        minlength: 8,
        required: [true, 'Phone number required'],
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)



