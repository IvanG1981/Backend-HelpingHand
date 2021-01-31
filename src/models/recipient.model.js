const { Schema, model, models } = require('mongoose')


const recipientSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: ''
  },
  bio: {
    type: String,
    required: true,
    maxlength: 150,
    default: ''
  },
  profileImage: {
    type: String,
    default: ''
  },
  need: {
    type: Number,
    required: true,
    default: 0
  }
},{
  timestamps: true
})

const Recipient = model('Recipient', recipientSchema)

module.exports = Recipient
