import React from "react";
import { Route, Routes } from "react-router-dom";

//Components
import Main from "./components/main";

export default function App(){
    return(
        <div>
            <Routes>
                <Route path="/" element={<Main />}/>
            </Routes>
        </div>
    )
}