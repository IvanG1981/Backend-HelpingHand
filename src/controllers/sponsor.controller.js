const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptRandomString = require('crypto-random-string');
const Sponsor = require('../models/sponsor.model');


module.exports = {
  async list(req, res) {
    try {
      const sponsors = await Sponsor.find()
      if( sponsors.length === 0 ) {
        throw new Error('Could not find any sponsors')
      }
      res.status(200).json( { message: 'sponsors found', data: sponsors } )
    }
    catch(err) {
      res.status(400).json( { message: err.message } )
    }
  },
  async show(req, res) {
    try {
      const id = req.userId;
      const sponsor = await Sponsor.findById(id)
      if(!sponsor) {
        throw new Error('Sponsor not found in the database')
      }
      res.status(200).json( { message: "Sponsor found", data: sponsor } )
    }
    catch(err) {
      res.status(400).json( { message: err.message } )
    }
  },
  async signup( req, res) {
    try {
      const { email, password } = req.body;
      if(password.length < 4 || password.length > 8) {
        throw new Error('Your password must be between 4 and 8 characters long');
      }
      const encPassword = await bcrypt.hash( password, 8 );
      const sponsor = await Sponsor.create( { email, password: encPassword } );

      const token = jwt.sign(
        { id: sponsor._id },
        process.env.SECRET,
        { expiresIn: 60 * 60 * 24 },
      );

      res.status(201).json( { token } )
    }
    catch(err) {
      res.status(400).json({ message: err.message })
    }
  },
  async signin(req, res) {
    try {
      const { email, password } = req.body;
      const sponsor = await Sponsor.findOne( { email } );
      if(!sponsor) {
        throw new Error('Invalid email or password');
      }
      const isValid = await bcrypt.compare( password, sponsor.password );
      if(!isValid) {
        throw new Error('Invalid email or password');
      }
      const token = jwt.sign(
        { id: sponsor._id },
        process.env.SECRET,
        { expiresIn: 60 * 60 * 24 },
      );
      res.status(201).json( { token } );
    }
    catch(err) {
      res.status(400).json( { message: err.message } );
    }
  },
  async destroy(req,res) {
    try {
      const id = req.userId;
      const sponsor = await Sponsor.findByIdAndDelete(id)
      if(!sponsor) {
        throw new Error('Sponsor not found in the database')
      }
      res.status(200).json( { message: 'Sponsor Deleted', data: sponsor } )
    }
    catch(err) {
      res.status(400).json( { message: err.message } )
    }
  },
  async update(req, res) {
    try {
      const id = req.userId;
      const sponsor = await Sponsor.findByIdAndUpdate( id, req.body, { new: true, runValidators: true } )
      if(!sponsor){
        throw new Error('Sponsor not found')
      }
      res.status(200).json( { message: 'Sponsor Information Updated', data: sponsor } )
    }
    catch(err) {
      res.status(400).json( { message: err.message } )
    }
  }
}
