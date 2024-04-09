const mongoose = require("mongoose");
const Schema = mongoose.Schema

const workstation = new Schema({
    name: {type: String, required: true},
    LaborType: {type: String, required: true},
    amount: {type: Number, required: true},
    hours: {type: Number, required: true},
    availability: {type: Number},
    capacity: {type: [Number]}
},{
    timestamps: true
});

module.exports = mongoose.model("workstation", workstation);