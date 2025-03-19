import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./userContext/userContext";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import NavBar_Cruit from "./components/NavBar_Cruit";
import Footer from "./components/Footer";
import ImgBg from "./components/ImgBg";
import Profile from "./components/Profile";
import Job from "./components/Job";
import Register from "./components/Register";
import Login from "./components/Login";
import CreateJob from "./components/CreateJob";
import CompDetail from "./components/CompDetail";
import Candidate from "./components/Candidate";
import ProtectedRoute from "./components/ProtectedRoute";
import Jobseeker from "./Layout/Jobseeker";
import Admin from "./Layout/Admin";
import Recruiter from "./Layout/Recruiter";
// function getContent() {
//   const role = localStorage.getItem("ROLE")
//   console.log(role)
//   if (!role) {
//     return <Navigate to="/login" />
//   }
//   if (role === "jobseeker") {
//     return <Navigate to="/jobseeker" />
//   }
//   if (role === "recruiter") {
//     return <Navigate to="/recruiter" />
//   }
//   if (role === "admin") {
//     return <Navigate to="/admin" />
//   }
//   return <Navigate to="/login" />
// }
const App = () => {
  // const [user, setUser] = useState(null);

  // // Xử lý đăng nhập
  // const handleLogin = (userData) => {
  //   setUser(userData);
  // };

  // // Xử lý đăng xuất
  // const handleLogout = () => {
  //   setUser(null);
  // };

  // console.log(user);
  const role = localStorage.getItem("ROLE")
  // console.log(role)
  return (
    
    <div className="min-h-[100vh] relative">
      <Router>
        {(role === "recruiter")? (<NavBar_Cruit />) : (<NavBar />)}
        <Routes>
          <Route path="/" element={<Navigate to="/login"/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/jobseeker" element={
            <ProtectedRoute name="jobseeker" children={<Jobseeker />} />
          }>
            <Route index element={<Navigate to="/jobseeker/homepage" replace />} />
            <Route path="homepage" element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="job" element={<Job />} />
          </Route>
          <Route path="/recruiter" element={
            <ProtectedRoute name="recruiter">
            <Recruiter />
          </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/recruiter/homepage" replace />} />
            <Route path="homepage" element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="job" element={<Job />} />
          </Route>
          <Route path="/admin" element={
            <ProtectedRoute name="admin" children={<Admin />} />
          }>
            <Route index element={<Navigate to="/admin/homepage" replace />} />
            <Route path="homepage" element={<Home />} />
          </Route>
          <Route path="/createjob" element={<CreateJob />} />
          <Route path="/compdetail:id" element={<CompDetail />} />
          <Route path="/candidate:id" element={<Candidate />} />
          <Route path="/imgbg" element={<ImgBg />} />
          <Route path="*" element={<Login/>} />
        </Routes>


        <Footer />
      </Router>
    </div>
  );
};

export default App;
