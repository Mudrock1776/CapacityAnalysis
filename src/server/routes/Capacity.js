const express = require("express");

const Routes = express.Router();
const capacity = require("../controllers/Capacity");

//part routes
//adds a new part
/* Takes in a post request as such: 
{
    name: <part name>,
    months: <list of parts made for the month>
}
Returns 403 if name taken, otherwise returns complete list of parts */
Routes.route("/part/add").post((req,res) =>{
    capacity.createPart(req,res);
});

//lists part, post request for all parts
Routes.route("/part/list").post((req,res) => {
    capacity.listPart(req,res);
});

//deletes part
/* Takes in post request as such:
{
    id: <part id>
}
returns complete list of parts */
Routes.route("/part/delete").post((req,res) => {
    capacity.deletePart(req,res);
});

//fetch specific part
/* takes in post request as such:
{
    id: <part id>
}
returns part */
Routes.route("/part/fetch").post((req,res) => {
    capacity.fetchPart(req,res);
});

//updates a specific part
/* takes in post request as such:
{
    id: <part id>,
    name: <part name>,
    months: <list of parts to be made where the index is a month>
}
returns 403 status if name taken otherwise returns the list of parts */
Routes.route("/part/update").post((req,res) => {
    capacity.updatePart(req,res);
});

//workstation routes
//adds a new workstation
/* Takes in a post request as such: 
{
    name: <workstation name>,
    LaborType: <type of labor>,
    amount: <amount of WS>,
    hours: <how many hours per week the station is available for>
}
Returns 403 if name taken, otherwise returns complete list of workstaions */
Routes.route("/workstation/add").post((req,res) =>{
    capacity.createWorkstation(req,res);
});

//lists workstation, post request returns a list of workstations
Routes.route("/workstation/list").post((req,res) => {
    capacity.listWorkstation(req,res);
});

//deletes workstation
/* Takes in post request as such:
{
    id: <workstation id>
}
returns complete list of workstations */
Routes.route("/workstation/delete").post((req,res) => {
    capacity.deleteWorkstation(req,res);
});

//fetch specific workstation
/* takes in post request as such:
{
    id: <workstation id>
}
returns workstation */
Routes.route("/workstation/fetch").post((req,res) => {
    capacity.fetchWorkstation(req,res);
});

//updates a specific workstation
/* takes in post request as such:
{
    id: <workstation id>,
    name: <workstation name>,
    LaborType: <type of labor>,
    amount: <amount of WS>,
    hours: <how many hours per week the station is available for>
}
returns 403 status if name taken otherwise returns the list of workstations */
Routes.route("/workstation/update").post((req,res) => {
    capacity.updateWorkstation(req,res);
});

//process routes
//adds a new process
/* Takes in a post request as such: 
{
    name: <process name>,
    part: <part assigned>,
    workstation: <workstation assigned>,
    MT: <how long it takes to run a batch in Machine Time>,
    LT: <how long it takes to run a batch in Labour Time>,
    BS: <batch size>,
    RTY: <rolled throughput yield>
}
Returns 403 if name taken, otherwise returns complete list of processes */
Routes.route("/process/add").post((req,res) =>{
    capacity.createProcess(req,res);
});

//lists process, post request returns a list of processes
Routes.route("/process/list").post((req,res) => {
    capacity.listProcess(req,res);
});

//deletes process
/* Takes in post request as such:
{
    id: <process id>
}
returns complete list of processes */
Routes.route("/process/delete").post((req,res) => {
    capacity.deleteProcess(req,res);
});

//fetch specific process
/* takes in post request as such:
{
    id: <process id>
}
returns process */
Routes.route("/process/fetch").post((req,res) => {
    capacity.fetchProcess(req,res);
});

//updates a specific process
/* takes in post request as such:
{
    id: <process id>,
    name: <process name>,
    part: <part assigned>,
    workstation: <workstation assigned>,
    MT: <how long it takes to run a batch in Machine Time>,
    LT: <how long it takes to run a batch in Labour Time>,
    BS: <batch size>,
    RTY: <rolled throughput yield>
}
returns 403 status if name taken otherwise returns the list of processes */
Routes.route("/process/update").post((req,res) => {
    capacity.updateProcess(req,res);
});

//Generates a capacity report and adds it to the the workstations, returns a list of workstations, takes in a post request
Routes.route("/capacity").post((req,res) => {
    capacity.capacityReport(req,res);
})

module.exports = Routes;