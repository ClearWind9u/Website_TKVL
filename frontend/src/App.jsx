import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Login from './components/Login';  
import Register from './components/Register';
import Profile from './components/Profile';

const App = () => {
  const [user, setUser] = useState(null); // Giả lập trạng thái đăng nhập

  // Function giả lập đăng nhập
  const login = (fakeUser) => {
    setUser(fakeUser);
  };

  // Function đăng xuất
  const logout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="bg-white">
        <NavBar user={user} logout={logout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login login={login} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" />} /> {/* Điều hướng về trang chủ nếu đường dẫn sai */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
