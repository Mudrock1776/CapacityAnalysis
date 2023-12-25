const express = require("express");

const Routes = express.Router();
const capacity = require("../controllers/Capacity");

//part routes
//adds a new part
Routes.route("/part/add").post((req,res) =>{
    capacity.createPart(req,res);
});

//lists part
Routes.route("/part/list").post((req,res) => {
    capacity.listPart(req,res);
});

//deletes part
Routes.route("/part/delete").post((req,res) => {
    capacity.deletePart(req,res);
});

//fetch specific part
Routes.route("/part/fetch").post((req,res) => {
    capacity.fetchPart(req,res);
});

//updates a specific part
Routes.route("/part/update").post((req,res) => {
    capacity.updatePart(req,res);
});

//workstation routes
//adds a new workstation
Routes.route("/workstation/add").post((req,res) =>{
    capacity.createWorkstation(req,res);
});

//lists workstation
Routes.route("/workstation/list").post((req,res) => {
    capacity.listWorkstation(req,res);
});

//deletes workstation
Routes.route("/workstation/delete").post((req,res) => {
    capacity.deleteWorkstation(req,res);
});

//fetch specific workstation
Routes.route("/workstation/fetch").post((req,res) => {
    capacity.fetchWorkstation(req,res);
});

//updates a specific workstation
Routes.route("/workstation/update").post((req,res) => {
    capacity.updateWorkstation(req,res);
});

//process routes
//adds a new process
Routes.route("/process/add").post((req,res) =>{
    capacity.createProcess(req,res);
});

//lists process
Routes.route("/process/list").post((req,res) => {
    capacity.listProcess(req,res);
});

//deletes process
Routes.route("/process/delete").post((req,res) => {
    capacity.deleteProcess(req,res);
});

//fetch specific process
Routes.route("/process/fetch").post((req,res) => {
    capacity.fetchProcess(req,res);
});

//updates a specific process
Routes.route("/process/update").post((req,res) => {
    capacity.updateProcess(req,res);
});

module.exports = Routes;