require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connect } = require('./src/db');
const sponsorRouter = require('./src/routes/sponsor');
const recipientRouter = require('./src/routes/recipient');

const port = process.env.PORT;
const app = express();

connect();
app.use(cors());
app.use(express.json());
app.use('/sponsors', sponsorRouter);
app.use('/recipients', recipientRouter);

app.listen(port, ()=>{
  console.log(`Succesfully running at ${port}`);
});

