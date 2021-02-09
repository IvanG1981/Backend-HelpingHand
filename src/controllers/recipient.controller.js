const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptRandomString = require('crypto-random-string');
const Recipient = require('../models/recipient.model');
const Admin = require('../models/admin.model');


module.exports = {
  async list(req, res) {
    try {
      const recipients = await Recipient.find()
                                        .populate
                                          (
                                            {
                                              path: 'contributions',
                                              select: 'amount receiver emitter invoiceNumber',
                                              populate: {
                                                path: 'emitter',
                                                select: 'email'
                                              }
                                            }
                                          )
      if( recipients.length === 0 ){
        throw new Error( 'Could not find recipients' )
      }
      res.status(200).json( { message: 'Recipients found',
                              data: recipients } )
    }
    catch(err) {
      res.status(400).json( { message: err.message } )
    }
  },
  async create(req, res) {
    try {
      const id = req.userId;
      const { name, bio, need, profileImage } = req.body;
      const admin = await Admin.findById(id)
      if(!admin){
        throw new Error('User does not exist in Administrator Database')
      }
      const recipient = await Recipient.create( { name, bio, need, profileImage } );
      res.status(200).json( { message: 'Recipient Created',
                              data: recipient } );
    }
    catch(err) {
      res.status(400).json( { message: err.message } )
    }
  },
  async update(req, res) {
    try {
      const id = req.userId;
      const { recipientId }  = req.params;
      const admin = await Admin.findById(id)
      if(!admin){
        throw new Error('User does not exist in Administrator Database')
      }
      const recipient = await Recipient
                                .findByIdAndUpdate(
                                                    recipientId,
                                                    req.body,
                                                    {
                                                      new: true,
                                                      runValidators: true
                                                    }
                                                  )
      if(!recipient) {
        throw new Error('Recipient not found')
      }
      res.status(200).json( { message: 'Recipient Data Updated'} );
    }
    catch(err) {
      res.status(400).json( { message: err.message } );
    }
  },
  async destroy(req,res) {
    try {
      const { recipientId }= req.params;
      const id = req.userId;
      const admin = await Admin.findById(id)
      if(!admin){
        throw new Error('User does not exist in Administrator Database')
      }
      const recipient = await Recipient.findById( recipientId )
      if(!recipient) {
        throw new Error('Recipient not found in the database')
      }
      await Recipient.deleteOne( { _id: recipient._id } );
      res.status(200).json( { message: 'Recipient Deleted', data: recipient } )
    }
    catch(err) {
      res.status(400).json( { message: err.message } )
    }
  },
  async show(req, res) {
    try {
      const { recipientId }= req.params;
      const recipient = await Recipient.findById(recipientId)
                                       .populate
                                          (
                                            {
                                              path: 'contributions',
                                              select: 'amount receiver emitter invoiceNumber',
                                              populate: {
                                                path: 'emitter',
                                                select: 'email'
                                              }
                                            }
                                          )
      if(!recipient) {
        throw new Error('Recipient not found in the database')
      }
      res.status(200).json( { message: "Recipient found", data: recipient } )
    }
    catch(err) {
      res.status(400).json( { message: err.message } )
    }
  }

}
