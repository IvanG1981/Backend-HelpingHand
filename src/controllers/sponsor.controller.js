const Sponsor = require('../models/sponsor.model');


module.exports = {
  async show(req, res){
    try{
      const { sponsorId } = req.params;
      const sponsor = await Sponsor.findById(sponsorId)
      if(!sponsor){
        throw new Error('Sponsor not found in the database')
      }
      res.status(200).json({ message: "Sponsor found", data: sponsor })
    }
    catch(err){
      res.status(400).json({ message: err.message })
    }
  },
  async signup( req, res){
    try{
      const { email, password } = req.body;
      if(password.length < 4 || password.length > 8){
        throw new Error('Your password must be between 4 and 8 characters long')
      }
      const sponsor = await Sponsor.create({ email, password })
      res.status(201).json(sponsor)
    }
    catch(err){
      res.status(400).json({ message: err.message })
    }
  },
  async destroy(req,res) {
    const  { sponsorId } = req.params;
    try {
      const sponsor = await Sponsor.findByIdAndDelete(sponsorId)
      if(!sponsor){
        throw new Error('Sponsor not found in the database')
      }
      res.status(200).json({ message: 'Sponsor Deleted', data: sponsor })
    }
    catch(err){
      res.status(400).json({ message: err.message })
    }
  }
}
