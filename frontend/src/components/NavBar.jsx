import React, { useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineBell } from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';
import { MdLogout } from "react-icons/md";
import { UserContext } from "../userContext/userContext";

const NavBar = () => {
  const navigate = useNavigate();
  const { logout } = useContext(UserContext);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const notifications = [
    "Có một công việc mới phù hợp với bạn từ Công ty XYZ.",
    "Bạn có một tin nhắn mới từ nhà tuyển dụng HCMUT.",
    "Đừng quên hoàn thành hồ sơ ứng tuyển của bạn trước 13/12/2024 nhé!"
  ];
  // console.log(userInfo);
  const userInfo = JSON.parse(localStorage.getItem("USER"));
  console.log(userInfo.role);
  console.log(localStorage.getItem("TOKEN"));

  const handleAvatarClick = () => setIsDropdownVisible(!isDropdownVisible);
  const handleLogout = () => {
    setIsDropdownVisible(false);
    logout();

    navigate('/login');
  };
  const handleBellClick = () => setIsOpen(!isOpen);

  const menuItems = userInfo?.role === "recruiter" ? [
    { path: "/recruiter/homepage", label: "Trang chủ" },
    { path: "/recruiter/create", label: "Tạo công việc" },
    { path: "/recruiter/job", label: "Công việc" },
    { path: "/recruiter/candidate", label: "Ứng viên" }
  ] : [
    { path: "/jobseeker/homepage", label: "Trang chủ" },
    { path: "/jobseeker/profile", label: "Hồ sơ & CV" },
    { path: "/jobseeker/job", label: "Công việc" },
    { path: "/jobseeker/status", label: "Trạng thái" },
    { path: "/jobseeker/favor", label: "Yêu thích" }
  ];

  return (
    <nav className="navBar flex justify-between items-center px-6 py-3 bg-white shadow-md">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Logo" className="w-[40px] h-[40px] rounded-full" />
        <div className="text-left">
          <h1 className="text-lg font-semibold text-gray-800">ITJOBSearch</h1>
          <span className="text-sm text-gray-500">Trang web tìm việc làm</span>
        </div>
      </div>
      {/* Menu */}
      <div className="flex gap-6 text-gray-700">
        {menuItems.map(item => (
          <Link key={item.path} to={item.path} className="hover:text-black">{item.label}</Link>
        ))}
      </div>
      {/* Buttons */}
      <div className="flex items-center gap-3">
        {userInfo ? (
          <>
            <div className="relative">
              <AiOutlineBell className="text-[25px] cursor-pointer" onClick={handleBellClick} />
              {notifications.length > 0 && <span className="absolute top-0 right-0 bg-red-500 w-3 h-3 rounded-full"></span>}
              {isOpen && (
                <div className="absolute top-10 right-0 bg-white border-2 border-gray-300 rounded-[20px] p-4 shadow-lg w-[250px]">
                  <h3 className="font-semibold text-lg">Thông báo</h3>
                  <ul className="mt-2 text-sm">
                    {notifications.map((notification, index) => (
                      <li key={index} className="py-2 border-b">{notification}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative" onClick={handleAvatarClick}>
                <FaUserCircle className="w-[35px] h-[35px] text-gray-500 cursor-pointer" />
              </div>
              <span className="text-sm text-gray-600">{(userInfo.role === "recruiter") ? "Nhà tuyển dụng" : "Người tìm việc"}</span>
            </div>
            {isDropdownVisible && (
              <div className="absolute top-[50px] right-0 bg-white border-2 border-gray-300 rounded-lg w-[250px] shadow-md p-4 z-9999">
                <div className="flex flex-col items-center gap-3 mb-4">
                  <FaUserCircle className="w-[80px] h-[80px] rounded-full object-cover text-gray-500" />
                  <div className="text-center">
                    <h2 className="font-semibold">{userInfo.name}</h2>
                    <p className="text-sm text-gray-500">{userInfo.email}</p>
                  </div>
                </div>
                <ul className="space-y-2 items-center text-center">
                  <li>
                    <Link to={`/${userInfo.role}/profile`} className="cursor-pointer text-gray-700 hover:text-blue-500 py-2">
                      Hồ sơ
                    </Link>
                  </li>
                  <li className="cursor-pointer text-gray-700 hover:text-blue-500 py-2">Cài đặt</li>
                  <li className="cursor-pointer text-red-500 hover:text-red-600 flex items-center justify-center gap-2 py-2" onClick={handleLogout}>
                    <MdLogout className="text-lg" />
                    Đăng xuất
                  </li>
                  <li className="cursor-pointer text-gray-700 hover:text-blue-500 py-2" onClick={() => setIsDropdownVisible(false)}>
                    Thoát
                  </li>
                </ul>
              </div>
            )}
          </>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-black">Đăng nhập</Link>
            <Link to="/register" className="px-4 py-2 bg-black text-white rounded-md">Đăng ký</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;