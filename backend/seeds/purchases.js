const mongoose = require('mongoose');
const Purchase = require('../models/Purchase');
require('dotenv').config();


const resetPurchases = async () => {
  await Purchase.deleteMany();
};

module.exports = resetPurchases;