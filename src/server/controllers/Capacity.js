const part = require("../models/parts");
const workstation = require("../models/workstations");
const process = require("../models/processes");
const mongoose = require("mongoose");

//parts
//creates a new part
exports.createPart = async (req, res) => {
    var newPart = new part(req.body);
    try {
        if (await part.exists({name:req.body.name})){
            res.status(403).send({error: "Part name taken"})
        } else {
            await newPart.save();
            res.status(200).send({error: "Created part"});
        }
    } catch(err){
        res.status(400).send({error: err});
    }
}

//lists all parts
exports.listPart = async (req, res) => {
    try{
        var parts = await part.find({});
        res.status(200).send(parts);
    } catch (err) {
        res.status(400).send({error: err});
    }
}

//Deletes part
exports.deletePart = async (req, res) => {
    try{
        await part.findByIdAndDelete(req.body.id);
        await this.listPart(req,res);
    } catch (err) {
        res.status(400).send({error: err});
    }
}

//fetchs a specific part
exports.fetchPart = async (req, res) => {
    try{
        var fetchedPart = await part.findById(req.body.id);
        res.status(200).send(fetchedPart);
    } catch (err) {
        res.status(400).send({error: err});
    }
}

//updates a part
exports.updatePart = async (req, res) => {
    console.log(req.body)
    try {
        if (await part.exists({name: req.body.name, _id: {$ne: req.body.id}})){
            res.status(403).send({error: "New Name taken"});
        } else {
            var oldPart = await part.findById(req.body.id);
            await process.updateMany({part:oldPart.name},{part:req.body.name});
            await part.findByIdAndUpdate(req.body.id, {
                name: req.body.name,
                months: req.body.months
            });
            await this.listPart(req,res);
        }
    } catch (err) {
        console.log(err);
        res.status(400).send({error: err});
    }
}

//workstations
//creates a new workstation
exports.createWorkstation = async (req, res) => {
    var newWorkstation = new workstation(req.body);
    try {
        if (await workstation.exists({name:req.body.name})){
            res.status(403).send({error: "Workstation name taken"})
        } else {
            await newWorkstation.save();
            res.status(200).send({error: "Created workstation"});
        }
    } catch(err){
        res.status(400).send({error: err});
    }
}

//lists all workstation
exports.listWorkstation = async (req, res) => {
    try{
        var workstations = await workstation.find({});
        res.status(200).send(workstations);
    } catch (err) {
        res.status(400).send({error: err});
    }
}

//Deletes workstation
exports.deleteWorkstation = async (req, res) => {
    try{
        await workstation.findByIdAndDelete(req.body.id);
        await this.listWorkstation(req,res);
    } catch (err) {
        res.status(400).send({error: err});
    }
}

//fetchs a specific workstation
exports.fetchWorkstation = async (req, res) => {
    try{
        var fetchedWorkstation = await workstation.findById(req.body.id);
        res.status(200).send(fetchedWorkstation);
    } catch (err) {
        res.status(400).send({error: err});
    }
}

//updates a workstation
exports.updateWorkstation = async (req, res) => {
    try {
        if (await workstation.exists({name: req.body.name, _id: {$ne: req.body.id}})){
            res.status(403).send({error: "New Name taken"});
        } else {
            var oldWorkstation = await workstation.findById(req.body.id);
            await process.updateMany({workstation: oldWorkstation.name}, {name: req.body.name});
            await workstation.findByIdAndUpdate(req.body.id, {
                name: req.body.name,
                LaborType: req.body.LaborType,
                amount: req.body.amount,
                hours: req.body.hours,
                availability: req.body.availability,
                capacity: req.body.capacity
            });
            await this.listWorkstation(req,res);
        }
    } catch (err) {
        res.status(400).send({error: err});
    }
}

//process
//creates a new process
exports.createProcess = async (req, res) => {
    var newProcess = new process(req.body);
    try {
        if (await process.exists({name:req.body.name})){
            res.status(403).send({error: "Process name taken"})
        } else {
            await newProcess.save();
            res.status(200).send({error: "Created process"});
        }
    } catch(err){
        res.status(400).send({error: err});
    }
}

//lists all process
exports.listProcess = async (req, res) => {
    try{
        var processes = await process.find({});
        res.status(200).send(processes);
    } catch (err) {
        res.status(400).send({error: err});
    }
}

//Deletes process
exports.deleteProcess = async (req, res) => {
    try{
        await process.findByIdAndDelete(req.body.id);
        await this.listProcess(req,res);
    } catch (err) {
        res.status(400).send({error: err});
    }
}

//fetchs a specific process
exports.fetchProcess = async (req, res) => {
    try{
        var fetchedProcess = await process.findById(req.body.id);
        res.status(200).send(fetchedProcess);
    } catch (err) {
        res.status(400).send({error: err});
    }
}

//updates a process
exports.updateProcess = async (req, res) => {
    try {
        if (await process.exists({name: req.body.name, _id: {$ne: req.body.id}})){
            res.status(403).send({error: "New Name taken"});
        } else {
            await process.findByIdAndUpdate(req.body.id, {
                name: req.body.name,
                part: req.body.part,
                workstation: req.body.workstation,
                MT: req.body.MT,
                LT: req.body.LT,
                BS: req.body.BS,
                RTY: req.body.RTY
            });
            await this.listProcess(req,res);
        }
    } catch (err) {
        res.status(400).send({error: err});
    }
}