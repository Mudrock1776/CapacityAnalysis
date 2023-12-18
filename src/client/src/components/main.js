import React, {useState, useEffect} from "react";

export default function Main(){
    const [form, setForm] = useState({
        name: "",
        months: [],
    });
    const [err, setErr] = useState("");
    const [parts, setParts] = useState([]);
    
    function updateForm(value){
        return setForm((prev) => {
            return { ...prev, ...value};
        });
    }

    async function onSubmit(e){
        e.preventDefault();

        const newPart = { ...form};

        var req = await fetch("/part/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPart),
        });

        setForm({
            name: "",
            months: [],
        });
        var retValue = await req.json();
        setErr(retValue.error);
    }

    useEffect(() => {
        async function getParts(){
            const res = await fetch(`/part/list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const partlist = await res.json();
            setParts(partlist);
        }
        getParts();
        return;
    }, [parts.length]);

    async function deletePart(id){
        var res = await fetch("/part/delete",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id
            })
        });
        setParts(await res.json());
    }

    async function updatePart(id){
        const newPart = { ...form};
        var res = await fetch("/part/update",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                name: newPart.name,
                months: newPart.months
            })
        });
        setParts(await res.json());
    }

    function list() {
        return parts.map((part) => {
            return(<div><p>{part.name}</p><button onClick={() => deletePart(part._id)}>Delete</button><button onClick={() => updatePart(part._id)}>Update</button></div>);
        });
    }

    return(
        <div>
            <h3>Create new part</h3>
            <form onSubmit={onSubmit}>
                <label>Name</label><input type="text" value={form.name} onChange={(e) => updateForm({ name: e.target.value})} /><br />
                <input type="submit" value="Create part" />
            </form>
            <p>{err}</p>
            <div>{list()}</div>
        </div>
    )
}