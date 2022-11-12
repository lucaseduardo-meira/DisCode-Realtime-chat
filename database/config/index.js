const mongoose = require("mongoose");
require("dotenv/config");

const mongo_uri = process.env.MONGO_URI;

mongoose.connect(mongo_uri);

module.exports = mongoose;
