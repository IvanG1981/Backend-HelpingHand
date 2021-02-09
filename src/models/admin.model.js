const { Schema, model, models } = require('mongoose')

const emailRegexp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

const adminSchema = new Schema({
  email: {
    type: String,
    required: true,
    match: [emailRegexp, 'Invalid Email'],
    validate: [
      {
        validator(value){
          return models.Admin.findOne( { email: value })
            .then(admin => !admin )
            .catch( ()=> false )
        },
        message: "Email already exists"
      }
    ]
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  resetPasswordToken: {
    type: String,
    default: null
  }
},{
  timestamps: true
})

const Admin = model('Admin', adminSchema)

module.exports = Admin;
