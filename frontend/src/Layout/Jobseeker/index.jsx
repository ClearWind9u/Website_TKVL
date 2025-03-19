import React from "react";
import NavBar from "../../components/NavBar";
import { Outlet } from "react-router-dom";
const Jobseeker = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
            <Outlet/>
        </div>
    )
}
export default Jobseeker;