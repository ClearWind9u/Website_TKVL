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

const App = () => {
  const [user, setUser] = useState(null);

  // Xử lý đăng nhập
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <UserProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-white">
          {/* Hiển thị NavBar theo role */}
          {user?.role === "recruiter" ? (
            <NavBar_Cruit user={user} logout={handleLogout} />
          ) : (
            <NavBar user={user} logout={handleLogout} />
          )}

          {/* Không hiển thị ImgBg khi ở trang Login hoặc Register */}
          {!(window.location.pathname.includes("login") || window.location.pathname.includes("register")) && <ImgBg />}

          <div className="flex-grow">
            <Routes>
              {/* Nếu chưa đăng nhập, chỉ có thể vào login hoặc register */}
              {!user ? (
                <>
                  <Route path="/login" element={<Login login={handleLogin} />} />
                  <Route path="/register" element={<Register login={handleLogin} />} />
                  <Route path="*" element={<Navigate to="/login" />} />
                </>
              ) : (
                <>
                  {/* Điều hướng theo role */}
                  {user.role === "jobseeker" ? (
                    <>
                      <Route path="/" element={<Home />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/job" element={<Job />} />
                    </>
                  ) : user.role === "recruiter" ? (
                    <>
                      <Route path="/" element={<Home />} />
                    </>
                  ) : (
                    <Route path="*" element={<Navigate to="/login" />} />
                  )}
                </>
              )}
            </Routes>
          </div>

          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
