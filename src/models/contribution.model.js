const { model, Schema } =  require('mongoose');

const contributionSchema = new Schema({
  amount: {
    type: Number,
    required: true
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'Recipient',
    required: true
  },
  emitter: {
    type: Schema.Types.ObjectId,
    ref: 'Sponsor',
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true
  }
},{
  timestamps: true
})

const Contribution = model('Contribution', contributionSchema )
module.exports = Contribution
