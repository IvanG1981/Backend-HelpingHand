const { Schema, model, models } = require('mongoose')

const emailRegexp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

const sponsorSchema = new Schema({
  email: {
    type: String,
    required: true,
    match: [emailRegexp, 'Invalid Email'],
    validate: [
      {
        validator(value){
          return models.Sponsor.findOne( { email: value })
            .then(sponsor => !sponsor )
            .catch( ()=> false )
        },
        message: "Email already exists"
      }
    ]
  },
  password: {
    type: String,
    required: true,
    minlength: 4
  }
},{
  timestamps: true
})

const Sponsor = model('Sponsor', sponsorSchema)

module.exports = Sponsor
