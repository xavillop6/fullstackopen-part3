const { Schema, model } = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const personSchema = new Schema({
    name: { type: String, index: true, unique: true, required: true, minLength: 3 },
    number: { type: String, required: true, minLength: 8, validate: {
        validator: function(v) {
          return /^\d{2,3}-\d{7,8}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }, }
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