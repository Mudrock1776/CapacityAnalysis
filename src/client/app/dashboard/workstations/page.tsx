'use client';
import { useEffect, useState } from "react";

export default function Page(){
    const [workstations, setWorkstations] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [addingWorkstation,setAddingWorkstation] = useState(0);
    const [newWorkstation, setNewWorkstation] = useState({
        name: "",
        LaborType: "Assembly",
        amount: 0,
        hours: 0,
    });
    const [err, setError] = useState("");

    useEffect(() => {
        async function getWorkstations(){
            const res = await fetch("/workstation/list",{
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                }
            });
            setWorkstations(await res.json());
        }
        getWorkstations();
        setAddingWorkstation(0);
        return;
    },[workstations.length]);

    function updateForm(value:any){
        return setNewWorkstation((prev) => {
            return {...prev, ...value};
        })
    }
    async function addWorkstation(e:any){
        e.preventDefault();
        const newEntry = { ...newWorkstation};
        const res = await fetch("/workstation/add", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newEntry)
        });
        if (res.status == 403){
            var cerr = await res.json();
            setError(cerr.error);
        } else if (res.status == 400){
            setError("There was a problem with the server");
        } else {
            setWorkstations(await res.json());
            setAddingWorkstation(0);
            setError("")
            setNewWorkstation({
                name: "",
                LaborType: "Assembly",
                amount: 0,
                hours: 0,
            });
        }
    }
    async function deleteWorkstation(id:string) {
        const res = await fetch("/workstation/delete", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id
            })
        });
        setWorkstations(await res.json());
    }
    async function updateWorkstation(workstation:any, target:string, value:any) {
        workstation.id = workstation._id;
        switch (target) {
            case "LaborType":
                workstation.LaborType = value;
                break;
            case "amount":
                if (value == "" || value < 0){
                    value = 0;
                }
                workstation.amount = value
                break;
            case "hours":
                if (value == "" || value < 0){
                    value = 0;
                }
                workstation.hours = value;
                break;
        }
        const res = await fetch("/workstation/update", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(workstation)
        });
        setWorkstations(await res.json());
    }

    function workstationAdderForm(){
        if (addingWorkstation == 1){
            return(
                <form className="max-w-sm ml-[34%] border-2 rounded-md border-black bg-gray-500 p-5 absolute z-50">
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Workstation Name</label>
                        <input value={newWorkstation.name} onChange={(e) => updateForm({ name: e.target.value })} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Workstation Name" required />
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Labor Type</label>
                        <select value={newWorkstation.LaborType} onChange={(e) => updateForm({ LaborType: e.target.value })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required >
                            <option value="Assembly">Assembly</option>
                            <option value="QA">Quality Assurance</option>
                            <option value="Test">Test</option>
                        </select>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount</label>
                        <input value={newWorkstation.amount} onChange={(e) => updateForm({ amount: e.target.value })} type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Amount" required />
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hours/Week</label>
                        <input value={newWorkstation.hours} onChange={(e) => updateForm({ hours: e.target.value })} type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Hours" required />
                    </div>
                    <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{err}</p>
                    <button type="submit" onClick={addWorkstation} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    <button type="submit" onClick={() => setAddingWorkstation(0)} className="text-white ml-10 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Cancel</button>
                </form>
            )
        }
    }
    function list(){
        return workstations.map((workstation) => {
            if (workstation.name.match(search)){
                return(
                    <tr key={workstation.name} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {workstation.name}
                        </th>
                        <td className="px-6 py-4">
                            <select value={workstation.LaborType} onChange={(e) => updateWorkstation(workstation, "LaborType", e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required >
                                <option value="Assembly">Assembly</option>
                                <option value="QA">Quality Assurance</option>
                                <option value="Test">Test</option>
                            </select>
                        </td>
                        <td className="px-6 py-4">
                            <input value={workstation.amount} onChange={(e) => updateWorkstation(workstation, "amount", e.target.value)} type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </td>
                        <td className="px-6 py-4">
                            <input value={workstation.hours} onChange={(e) => updateWorkstation(workstation, "hours", e.target.value)} type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </td>
                        <td className="px-6 py-4">
                            <p onClick={() => deleteWorkstation(workstation._id)} className="font-medium cursor-pointer text-blue-600 dark:text-blue-500 hover:underline">Delete</p>
                        </td>
                    </tr>
                );
            }
        })
    }
    return (
        <div>
            {workstationAdderForm()}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="pb-4 bg-white dark:bg-gray-900">
                    <label className="sr-only">Search</label>
                    <div className="relative pt-3 ps-3 mt-1">
                        <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center pt-3 ps-6 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input onChange={(e) => setSearch(e.target.value)} value={search} type="text" id="table-search" className="pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items" />
                        <div className="float-right m-0 p-0">
                            <button type="button" onClick={() => setAddingWorkstation(1)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-0 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add Entry</button>
                        </div>
                    </div>
                </div>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Workstation Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Labor Type
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Amount
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Available Hours
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {list()}
                    </tbody>
                </table>
            </div>
        </div>
    )
}