'use client';
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { BarElement,  CategoryScale,Chart as ChartJS,Legend, LinearScale,Title, Tooltip } from "chart.js";


export default function Page(){
    const [bigErr, setBigErr] = useState("");
    const [parts, setParts] = useState<any[]>([]);
    const [workstations, setWorkstations] = useState<any[]>([]);
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [selectedStation, setSelectedStation] = useState<any>({
        name: "",
        capacity: [],
    });
    const [monthData, setMonthData] = useState<any>({
        labels: [],
        capacity: [],
    });
    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const d = new Date();
    ChartJS.register(CategoryScale, LinearScale, BarElement,Title,Tooltip,Legend);
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
            setSelectedStation({
                name: workstations[0].name,
                capacity: workstations[0].capacity,
            });
            selectMonth(0);
        }
        getData();
    }, [parts.length, workstations.length]);
    function selectWorkstation(name:string){
        workstations.forEach((workstation) => {
            if (workstation.name == name){
                setSelectedStation({
                    name: workstation.name,
                    capacity: workstation.capacity
                });
                return;
            }
        })
    }
    function selectMonth(index: number){
        let labels: any[] = [];
        let capacity: any[] = [];
        workstations.forEach((workstation) => {
            labels.push(workstation.name);
            capacity.push(workstation.capacity[index]);
        });
        setSelectedMonth(index);
        setMonthData({
            labels: labels,
            capacity: capacity,
        })
    }

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
                var Entry = month[currentMonth + index] +" "+ year;
                barLabels.push(Entry);
            }
            return(
                <div className="p-3 mb-2 bg-white text-dark">
                    <h1>Capacity by Workstation</h1>
                    <select onChange={(e) => selectWorkstation(e.target.value)} value={selectedStation.name}>
                        {workstations.map((workstation) => {
                            return(
                                <option value={workstation.name}>{workstation.name}</option>
                            );
                        })}
                    </select>                    
                    <div className="p-3 mb-2 bg-white text-dark">
                        <Bar data={{
                            labels: barLabels,
                            datasets: [{
                                label: "Capacity",
                                data: selectedStation.capacity,
                                backgroundColor: "green",
                            },
                        ],
                        }}
                        height={100}
                        options={{
                            responsive: true,
                            scales: {
                                yAxis: {
                                    beginAtZero: true,
                                    max: 100,
                                },
                            },
                            plugins: {
                                legend: { position: "bottom"},
                                title: {
                                    display:false,
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
    function monthGraph(){
        if (bigErr == "") {
            let currentMonth = d.getMonth();
            let year = d.getFullYear();
            let barLabels = [];
            for (let index = 0; index < selectedStation.capacity.length; index++) {
                if (currentMonth + index > 11){
                    currentMonth -= 12;
                    year += 1;
                }
                var Entry = {name: month[currentMonth + index] +" "+ year, value:index};
                barLabels.push(Entry);
            }
            return(
                <div className="p-3 mb-2 bg-white text-dark">
                    <h1>Capacity by Month</h1>
                    <select onChange={(e) => selectMonth(parseInt(e.target.value))} value={selectedMonth}>
                        {barLabels.map((month) => {
                            return(
                                <option value={month.value}>{month.name}</option>
                            );
                        })}
                    </select>                    
                    <div className="p-3 mb-2 bg-white text-dark">
                        <Bar data={{
                            labels: monthData.labels,
                            datasets: [{
                                label: "Capacity",
                                data: monthData.capacity,
                                backgroundColor: "green",
                            },
                        ],
                        }}
                        height={100}
                        options={{
                            responsive: true,
                            scales: {
                                yAxis: {
                                    beginAtZero: true,
                                    max: 100,
                                },
                            },
                            plugins: {
                                legend: { position: "bottom"},
                                title: {
                                    display:false,
                                    text:"Moduler Bar graph",
                                },
                            }
                        }}
                        />
                    </div>
                </div>
            );
        }
    }

    return (
        <div>
            {BIGERROR()}
            {workstationGraph()}
            {monthGraph()}
        </div>
    )
}