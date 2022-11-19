const mongoose = require("mongoose");
require("dotenv/config");

mongoose.connect("mongodb://localhost/DisCode");

module.exports = mongoose;
