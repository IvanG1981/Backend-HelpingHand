const Contribution = require('../models/contribution.model');
const Recipient = require('../models/recipient.model');
const Sponsor = require('../models/sponsor.model');
const Admin = require('../models/admin.model');


module.exports = {
  async list(req, res) {
    try {
      const id = req.userId;
      const admin = await Admin.findById(id)
      if(!admin){
        throw new Error('User does not exist in Administrator Database')
      }
      const contributions = await Contribution.find()
                                        .populate
                                          (
                                            {
                                              path: 'contributions',
                                              select: 'amount receiver emitter invoiceNumber',
                                              populate: {
                                                path: 'emitter receiver',
                                                select: 'email name'
                                              }
                                            }
                                          )
      if( contributions.length === 0 ){
        throw new Error( 'Could not find contributions' )
      }
      res.status(200).json(
        {
          message: 'Contributions found',
          data: contributions
        }
      )
    }
    catch(err) {
      res.status(400).json( { message: err.message } )
    }
  },
  async createMobileContribution(req, res){
    try {
      const { recipientId } = req.params;
      const sponsorId = req.userId;
      const recipient = await Recipient.findById(recipientId);
      const sponsor = await Sponsor.findById(sponsorId);
      const { ref_payco, valor } = req.body.data;
      const contribution = await Contribution.create({
        amount: valor,
        receiver: recipient,
        emitter: sponsor,
        invoiceNumber: ref_payco
      })

      sponsor.contributions.push(contribution)
      recipient.contributions.push(contribution)
      await sponsor.save( { validateBeforeSave: false } )
      await recipient.save( { validateBeforeSave: false } )

      const updateAccumulated = recipient.accumulated + contribution.amount;
      await Recipient.findOneAndUpdate(
        { _id: recipientId },
        { accumulated: updateAccumulated }
      )
      res.status(200).json( { message: 'Contribution Created-Recipient Accumulated updated' } )
    }
    catch(err) {
      res.status(400).json( { message: err.message } )
    }
  }
}
