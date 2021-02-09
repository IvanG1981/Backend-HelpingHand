const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');


module.exports = {
  async signup( req, res) {
    try {
      const admins = await Admin.find();
      if( admins.length > 5) {
        throw new Error('Admins team is full')
      }
      const { email, password } = req.body;
      if(password.length < 4 || password.length > 8) {
        throw new Error('Your password must be between 4 and 8 characters long');
      }
      const encPassword = await bcrypt.hash( password, 10 );
      const admin = await Admin.create( { email, password: encPassword } );

      const token = jwt.sign(
        { id: admin._id },
        process.env.SECRET,
        { expiresIn: 60 * 60 * 24 },
      );
      res.status(201).json( { token } )
    }
    catch(err) {
      res.status(400).json( { message: err.message } )
    }
  },
  async signin(req, res) {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne( { email } );
      if(!admin) {
        throw new Error('Invalid email or password');
      }
      const isValid = await bcrypt.compare( password, admin.password );
      if(!isValid) {
        throw new Error('Invalid email or password');
      }
      const token = jwt.sign(
        { id: admin._id },
        process.env.SECRET,
        { expiresIn: 60 * 60 * 24 },
      );
      res.status(201).json( { token } );
    }
    catch(err) {
      res.status(400).json( { message: err.message } );
    }
  }
}
