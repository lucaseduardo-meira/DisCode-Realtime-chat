const mongoose = require("mongoose");

const mongo_uri = process.env.MONGO_URI;

mongoose.connect("mongo_uri");

module.exports = mongoose;
