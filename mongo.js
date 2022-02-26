const mongoose = require('mongoose')

const generateId = (max) => Math.round(Math.random() * max)

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1)
}

const [, , password, newName, newNumber] = process.argv

const uri = `mongodb+srv://jasmine:${password}@cluster0.9pjao.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(uri)
    .then(() => { console.log('Database connected!'); })
    .catch(error => console.log(error))

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (newName && newNumber) {
    const person = new Person({
        id: generateId(100),
        name: newName,
        number: newNumber,
    })

    person.save().then(result => {
        console.log(`Added ${newName} number ${newNumber} to phonebook`);
        mongoose.connection.close()
    })
} else {
    Person
        .find({})
        .then(persons => {
            console.log('\nphonebook:')
            persons.forEach(person => console.log(person.name, person.number))
            mongoose.connection.close()
        })
}

