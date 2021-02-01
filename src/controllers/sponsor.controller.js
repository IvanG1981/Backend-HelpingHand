const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptRandomString = require('crypto-random-string');
const Sponsor = require('../models/sponsor.model');
const {
  transporter,
  welcome,
  removeAccount,
  sendResetEmail,
  confirmPasswordUpdate
} = require('../utils/mailer');


module.exports = {
  async list(req, res) {
    try {
      const sponsors = await Sponsor.find()
                                    .select('-password')
                                    .populate
                                      (
                                        {
                                          path: 'contributions',
                                          select: 'amount receiver emitter invoiceNumber',
                                          populate: {
                                            path: 'receiver',
                                            select: 'name'
                                          }
                                        }
                                      )
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
                                   .select('-password')
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
      await transporter.sendMail(welcome(sponsor))
      res.status(201).json( { token } )
    }
    catch(err) {
      res.status(400).json( { message: err.message } )
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
      const sponsor = await Sponsor.findById(id)
                                   .select('-password')
      const { email } = sponsor
      if(!sponsor) {
        throw new Error('Sponsor not found in the database')
      }
      await Sponsor.deleteOne( { _id: id } );
      await transporter.sendMail(removeAccount(email))
      res.status(200).json( { message: 'Sponsor Deleted', data: sponsor } )
    }
    catch(err) {
      res.status(400).json( { message: err.message } )
    }
  },
  async update(req, res) {
    try {
      const id = req.userId;
      const sponsor = await Sponsor
                              .findByIdAndUpdate(
                                                  id,
                                                  req.body,
                                                  {
                                                    new: true,
                                                    runValidators: true
                                                  }
                                                )
                              .select('-password')
      if(!sponsor) {
        throw new Error('Sponsor not found')
      }
      res.status(200).json( { message: 'Sponsor Information Updated',
                              data: sponsor } )
    }
    catch(err) {
      res.status(400).json( { message: err.message } )
    }
  },
  async resetEmail(req, res) {
    if(req.body.email === '') {
      res.status(400).send('email required')
    }
    try {
      const token = cryptRandomString( { length: 10 } )
      const sponsor = await Sponsor.findOneAndUpdate(
        { email: req.body.email },
        { resetPasswordToken: token }
      )
      if(!sponsor) {
        throw new Error('Cannot find email in database')
      }
      else {
        const { email } = sponsor
        await transporter.sendMail( sendResetEmail( email, token ) )
        res.status(200).json( { message: 'recovery email sent '} )
      }
    }
    catch(err) {
      res.status(400).json( { message: err.message } )
    }
  },
  async resetConfirm(req, res) {
    try {
      const { resetPasswordToken } = req.params;
      const sponsor = await Sponsor.findOne( { resetPasswordToken } );
      if(!sponsor) {
        throw new Error('password reset is invalid or expired');
      }
      res.status(200).json( { message: 'password reset link is ok',
                              data: sponsor.email } );
    }
    catch(err) {
      res.status(400).json( { message: err.message } )
    }
  },
  async updatePassword(req, res) {
    const { email, password } = req.body;
    try {
      if(password.length < 4 || password.length > 8) {
        throw new Error('Your password must be between 4 and 8 characters long');
      }
      const sponsor = await Sponsor.findOne( { email } )
      const { _id } = sponsor;
      if(!sponsor) {
        throw new Error('Invalid Email')
      }
      else {
        const encPassword = await bcrypt.hash( password, 8 );
        await Sponsor.findOneAndUpdate(
          { _id: _id },
          {
            resetPasswordToken: null,
            password: encPassword
          }
        )
      }
      await transporter.sendMail( confirmPasswordUpdate( email ) )
      res.status(200).json( { message: 'Password Updated!' } )
    }
    catch(err) {
      res.status(400).json( { message: err.message } )
    }
  }
}
