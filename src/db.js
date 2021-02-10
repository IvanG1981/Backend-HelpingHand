const mongoose = require('mongoose')

function connect() {
    const mongoURI = process.env.MONGO_URI
    mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });

    mongoose.connection.once('open',() =>
      console.log('Connected with HelpingHand database')
    );

    mongoose.connection.on('error',(err)=>
      console.log('Something went wrong')
    );
}

module.exports = { connect }


