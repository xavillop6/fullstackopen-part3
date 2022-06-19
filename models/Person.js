const { Schema, model } = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const personSchema = new Schema({
    name: { type: String, index: true, unique: true, required: true },
    number: { type: String, required: true }
})

personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = model('Person', personSchema)

module.exports = Person