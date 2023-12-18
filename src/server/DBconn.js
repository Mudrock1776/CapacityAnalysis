const mongoose = require("mongoose");
const url = process.env.MONGOURL || 'mongodb://localhost:27017/Capacity';
const DB = mongoose.connect(url, {useNewUrlParser: true});
console.log("Connected to Database")