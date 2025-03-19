import { Outlet } from "react-router-dom";
import React from "react";
import NavBar_Cruit from "../../components/NavBar_Cruit";
const Recruiter = () => {
    console.log('Recruiter Layout');
    return (
        <div>
            <Outlet />
        </div>
    )
}
export default Recruiter;