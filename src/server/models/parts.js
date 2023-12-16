const mongoose = require("mongoose");
const Schema = mongoose.Schema

const part = new Schema({
    name: {type: String, required: true},
    months: {type: [Number], required:true}
},{
    timestamps:true
});

module.exports = mongoose.model("part", part);