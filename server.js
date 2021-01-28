require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connect } = require('./src/db');
const sponsorRouter = require('./src/routes/sponsor');

const port = process.env.PORT;
const app = express();

connect();
app.use(cors());
app.use(express.json());
app.use('/sponsors', sponsorRouter);

app.listen(port, ()=>{
  console.log(`Succesfully running at ${port}`);
});

