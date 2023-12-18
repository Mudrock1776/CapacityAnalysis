const mongoose = require("mongoose");
const Schema = mongoose.Schema

const process = new Schema({
    name: {type: String, required: true},
    part: {type: String, required: true},
    workstation: {type: String, required: true},
    MT: {type: Number, required: true},
    LT: {type: Number, required: true},
    BS: {type: Number, required: true},
    RTY: {type: Number, required: true}
},{
    required:true
})