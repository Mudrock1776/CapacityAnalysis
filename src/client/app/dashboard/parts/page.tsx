'use client';
import { useState, useEffect } from "react";

export default function Page(){
    const [parts, setParts] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [monthLenght, setMonthLenght] = useState(0);
    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const d = new Date();

    useEffect(() => {
        async function getParts() {
            const res = await fetch('http://localhost:8080/part/list', {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                }
            });
            setParts(await res.json());
            if (parts.length > 0){
                setMonthLenght(parts[0].months.length);
            } else {
                setMonthLenght(1);
            }
        }
        getParts();
        return;
    });

    async function addPart() {
        var req = await fetch("http://localhost:8080/part/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: "Larry",
                months: [10,10,10]
            }),
        });
    }

    async function deletePart(id:string) {
        var err = await fetch("http://localhost:8080/part/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: id
            })
        })
    }
    async function addColumn(){
        var newParts = parts;
        newParts.forEach(async (part) => {
            part.months.push(0);
            part.id = part._id
            await fetch("http://localhost:8080/part/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(part)
            });
        });
        setParts(newParts);
    }
    async function updateAmount(index:number, value:number, part:any){
        part.id = part._id;
        part.months[index] = value;
        await fetch("http://localhost:8080/part/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(part)
        });
    }

    function tableHead(){
        let currentMonth = d.getMonth();
        let year = d.getFullYear();
        let months = []
        for (let index = 0; index < monthLenght; index++) {
            if (currentMonth + index > 11){
                currentMonth -= 12;
                year += 1;
            }
            var Entry = [currentMonth + index, year];
            months.push(Entry);
        }
        return months.map((Entry) => {
            return(
                <th scope="col" className="px-6 py-3">
                    {month[Entry[0]]} {Entry[1]}
                </th>
            )
        })
    }
    function list() {
        
        return parts.map((part) => {
            if (part.name.match(search)){
                var index = -1;
                return(
                    <tr key={part.name} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {part.name}
                        </th>
                        {part.months.map((month: any) => {
                            index += 1;
                            return(
                                <td className="px-6 py-4">
                                    <input type="number" onChange={(e) => updateAmount(index, parseInt(e.target.value), part)} id="number-input" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={month} required />
                                </td>
                            );
                        })}
                        <td className="px-6 py-4">
                            <p onClick={() =>deletePart(part._id)} className="font-medium cursor-pointer text-blue-600 dark:text-blue-500 hover:underline">Delete</p>
                        </td>
                    </tr>
                )
            }
        })
    }
    return (
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
                        <button type="button" onClick={addPart} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-0 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add Entry</button>
                        <button type="button" onClick={addColumn} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-0 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Add column</button>
                        <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-0 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Remove column</button>
                    </div>
                </div>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Part Name
                        </th>
                        {tableHead()}
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
    )
}