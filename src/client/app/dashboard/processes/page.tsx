'use client';
import { useEffect, useState } from "react";

export default function Page(){
    const [search, setSearch] = useState("");
    const [addingProcess, setAddingProcess] = useState(0);
    const [parts, setParts] = useState<any[]>([]);
    const [workstations, setWorkstations] = useState<any[]>([]);
    const [processes, setProcesses] = useState<any[]>([]);
    const [err, setError] = useState("");
    const [bigErr, setBigErr] = useState("");
    const [newProcess, setNewProcess] = useState({
        name: "",
        part: "",
        workstation: "",
        MT: 0,
        LT: 0,
        BS: 0,
        RTY: 0
    });

    function updateForm(value:any){
        return setNewProcess((prev) => {
            return {...prev, ...value};
        })
    }

    useEffect(() => {
        async function getEverything(){
            const resPart = await fetch('http://localhost:8080/part/list', {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                }
            });
            setParts(await resPart.json());
            const resWorkstation = await fetch("http://localhost:8080/workstation/list", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                }
            });
            setWorkstations(await resWorkstation.json());
            const resProcess = await fetch("http://localhost:8080/process/list", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                }
            });
            setProcesses(await resProcess.json());
        }
        getEverything();
        if (parts.length == 0){
            setBigErr("No Parts Created");
            return;
        }
        if (workstations.length == 0) {
            setBigErr("No Workstations Created");
            return;
        }
        updateForm({part: parts[0].name});
        updateForm({workstation: workstations[0].name});
        setBigErr("");
        setAddingProcess(0);
        setError("");
        return;
    }, [parts.length,workstations.length,processes.length]);

    async function addProcess(e:any){
        e.preventDefault();
        const newEntry = {...newProcess};
        const res = await fetch("http://localhost:8080/process/add", {
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
        } else{
            setProcesses(await res.json());
            setAddingProcess(0);
            setNewProcess({
                name: "",
                part: parts[0].name,
                workstation: workstations[0].name,
                MT: 0,
                LT: 0,
                BS: 0,
                RTY: 0
            })
        }
    }

    async function updateProcess(process:any, target:string, value:any){
        switch (target) {
            case "part":
                process.part = value
                break;
            case "workstation":
                process.workstation = value
                break;
            case "MT":
                process.MT = value
                break;
            case "LT":
                process.LT = value
                break;
            case "BS":
                process.BS = value
                break;
            case "RTY":
                process.RTY = value
                break;
        }
        process.id = process._id;
        const res = await fetch("http://localhost:8080/process/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(process)
        });
        setProcesses(await res.json());
    }
    async function deleteProcess(id:string) {
        const res = await fetch("http://localhost:8080/process/delete", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id
            })
        });
        setProcesses(await res.json())
    }

    function BIGERROR(){
        if (bigErr != ""){
            return(
                <div className="max-w-sm ml-[34%] border-2 rounded-md border-black bg-gray-500 p-5 absolute z-50">
                    <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Lacking Required Information to Create Process table</p>
                    <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{bigErr}</p>
                </div>
            )
        }
    }
    function processAdderForm() {
        if (addingProcess == 1 && bigErr == "") {
            return(
                <form className="max-w-sm ml-[34%] border-2 rounded-md border-black bg-gray-500 p-5 absolute z-50">
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Process Name</label>
                        <input value={newProcess.name} onChange={(e) => updateForm({ name: e.target.value })} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Process Name" required />
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Part</label>
                        <select value={newProcess.part} onChange={(e) => updateForm({ part: e.target.value })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required >
                            {parts.map((part) => {
                                return(
                                    <option value={part.name}>{part.name}</option>
                                )
                            })}
                        </select>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Workstation</label>
                        <select value={newProcess.workstation} onChange={(e) => updateForm({ workstation: e.target.value })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                            {workstations.map((workstation) => {
                                return(
                                    <option value={workstation.name}>{workstation.name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{err}</p>
                    <button type="submit" onClick={addProcess} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    <button type="submit" onClick={() => setAddingProcess(0)} className="text-white ml-10 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Cancel</button>
                </form>
            )
        }
    }
    function list(){
        if (bigErr == ""){
            return processes.map((process) => {
                if (process.name.match(search)) {
                    return (
                        <tr key={process.name} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {process.name}
                            </th>
                            <td className="px-6 py-4">
                            <select value={process.part} onChange={(e) => updateProcess(process, "part", e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required >
                                {parts.map((part) => {
                                    return(
                                        <option value={part.name}>{part.name}</option>
                                    )
                                })}
                            </select>
                            </td>
                            <td className="px-6 py-4">
                            <select value={process.workstation} onChange={(e) => updateProcess(process, "workstation", e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required >
                                {workstations.map((workstation) => {
                                    return(
                                        <option value={workstation.name}>{workstation.name}</option>
                                    )
                                })}
                            </select>
                            </td>
                            <td className="px-6 py-4">
                                <input value={process.MT} onChange={(e) => updateProcess(process, "MT", e.target.value)} type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </td>
                            <td className="px-6 py-4">
                                <input value={process.LT} onChange={(e) => updateProcess(process, "LT", e.target.value)} type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </td>
                            <td className="px-6 py-4">
                                <input value={process.BS} onChange={(e) => updateProcess(process, "BS", e.target.value)} type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </td>
                            <td className="px-6 py-4">
                                <input value={process.RTY} onChange={(e) => updateProcess(process, "RTY", e.target.value)} type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </td>
                            <td className="px-6 py-4">
                                <p onClick={() => deleteProcess(process._id)} className="font-medium cursor-pointer text-blue-600 dark:text-blue-500 hover:underline">Delete</p>
                            </td>
                        </tr>
                    )
                }
            })
        }
    }
    return (
        <div>
            {BIGERROR()}
            {processAdderForm()}
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
                            <button type="button" onClick={() => setAddingProcess(1)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-0 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add Entry</button>
                        </div>
                    </div>
                </div>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Process Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Part
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Workstation
                            </th>
                            <th scope="col" className="px-6 py-3">
                                MT
                            </th>
                            <th scope="col" className="px-6 py-3">
                                LT
                            </th>
                            <th scope="col" className="px-6 py-3">
                                BS
                            </th>
                            <th scope="col" className="px-6 py-3">
                                RTY
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
    );
}