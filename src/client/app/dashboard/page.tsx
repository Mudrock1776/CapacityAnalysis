'use client';
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { BarElement,  CategoryScale,Chart as ChartJS,Legend, LinearScale,Title, Tooltip } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement,Title,Tooltip,Legend);

export default function Page(){
    const [bigErr, setBigErr] = useState("");
    const [parts, setParts] = useState<any[]>([]);
    const [workstations, setWorkstations] = useState<any[]>([]);
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [selectedStation, setSelectedStation] = useState<any>({
        name: "",
        capacity: "",
    });
    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const d = new Date();

    useEffect(() => {
        async function getData(){
            var res = await fetch("http://localhost:8080/part/list", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            setParts(await res.json());
            if (parts.length == 0){
                setBigErr("No parts defined");
                return;
            }
            var res = await fetch("http://localhost:8080/workstation/list", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                }
            });
            setWorkstations(await res.json());
            if (workstations.length == 0){
                setBigErr("No workstations defined");
                return;
            }

            var res = await fetch("http://localhost:8080/capacity", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                }
            });
            setWorkstations(await res.json())
            setBigErr("");
            setSelectedStation(workstations[0]);
            setSelectedMonth(0)
        }
        getData();
    }, [parts.length, workstations.length]);

    function BIGERROR(){
        if (bigErr != ""){
            return(
                <div className="max-w-sm ml-[34%] border-2 rounded-md border-black bg-gray-500 p-5 absolute z-50">
                    <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Lacking Required Information to Create Capacity</p>
                    <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{bigErr}</p>
                </div>
            )
        }
    }

    function workstationGraph(){
        if (bigErr == ""){
            let currentMonth = d.getMonth();
            let year = d.getFullYear();
            let barLabels = [];
            for (let index = 0; index < selectedStation.capacity.length; index++) {
                if (currentMonth + index > 11){
                    currentMonth -= 12;
                    year += 1;
                }
                var Entry = month[currentMonth + index] + year;
                barLabels.push(Entry);
            }
            return(
                <div>
                    <h1>Capacity by workstation</h1>
                    <select onChange={(e) => {setSelectedStation(e.target.value)}} value={selectedStation.name}>
                        {workstations.map((workstation) => {
                            return(
                                <option value={workstation}>{workstation.name}</option>
                            );
                        })}
                    </select>                    
                    <div className="max-w-[650px]">
                        <Bar data={{
                            labels: barLabels,
                            datasets: [{
                                label: "total count/value",
                                data: selectedStation.capacity,
                                backgroundColor: "green",
                            },
                        ],
                        }}
                        height={400}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: "chartArea"},
                                title: {
                                    display:true,
                                    text:"Moduler Bar graph",
                                },
                            }
                        }}
                        />
                    </div>
                </div>
            )
        }
    }

    return (
        <div>
            {BIGERROR()}
            {workstationGraph()}
        </div>
    )
}