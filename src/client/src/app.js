import React from "react";
import { Route, Routes } from "react-router-dom";

//Components

export default function App(){
    return(
        <div>
            <Routes>
                <Route path="/" element={<h1>Hello World!</h1>}/>
            </Routes>
        </div>
    )
}