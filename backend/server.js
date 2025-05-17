const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json()).use(cors());

const routes = require('./routes'); 
app.use('/api', routes); 

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));


app.get('/', (_, res) => res.send('GymSite API'));



const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`Server running on port ${port}`));
