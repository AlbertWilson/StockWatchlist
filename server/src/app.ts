import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 9000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(require('./routes/controller'));

// Global error handling
app.use(function (err, _req, res) {
});

// perform a database connection when the server starts
mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser:true}, () => {
  console.log("Connected to DB!")
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});