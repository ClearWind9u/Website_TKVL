import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineBell } from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';
import { MdLogout } from "react-icons/md";

const NavBar = ({ user, logout }) => {
  const navigate = useNavigate();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Quản lý việc hiển thị box thông tin người dùng

  const [isLoggedIn, setIsLoggedIn] = useState(true); // Quản lý trạng thái đăng nhập, mặc định là chưa đăng nhập

  const handleAvatarClick = () => {
    setIsDropdownVisible(!isDropdownVisible); // Khi nhấp vào avatar, toggle (hiển thị/ẩn) dropdown
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsDropdownVisible(false);
    logout();
    navigate('/login');
  };

  // State để kiểm tra xem danh sách thông báo có mở hay không
  const [isOpen, setIsOpen] = useState(false);
  // State để lưu trữ danh sách thông báo
  const [notifications, setNotifications] = useState([
    "Có một công việc mới phù hợp với bạn từ Công ty XYZ.",
    "Bạn có một tin nhắn mới từ nhà tuyển dụng HCMUT.",
    "Đừng quên hoàn thành hồ sơ ứng tuyển của bạn trước 13/12/2024 nhé!"
  ]);

  // Hàm xử lý khi bấm vào chuông
  const handleBellClick = () => {
    setIsOpen(!isOpen);
  };

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
        <Link to="/" className="hover:text-black">Trang chủ</Link>
        <Link to="/profile" className="hover:text-black">Hồ sơ & CV</Link>
        <Link to="/job" className="hover:text-black">Công việc</Link>
        <Link to="/status" className="hover:text-black">Trạng thái</Link>
        <Link to="/favorites" className="hover:text-black">Yêu thích</Link>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <div className="relative">
              <li className="menuList text-[#6f6f6f] cursor-pointer p-2" onClick={handleBellClick}>
                <AiOutlineBell className="text-[25px]" />

                {/* Dấu chấm đỏ nếu có thông báo */}
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 w-3 h-3 rounded-full"></span>
                )}
              </li>

              {/* Hộp thông báo */}
              {isOpen && notifications.length > 0 && (
                <div className="absolute top-10 right-0 bg-white border-2 border-gray-300 rounded-[20px] p-4 shadow-lg w-[250px]">
                  <h3 className="font-semibold text-lg">Thông báo</h3>
                  <ul className="mt-2 text-sm">
                    {notifications.map((notification, index) => (
                      <li key={index} className="py-2 border-b">
                        {notification}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <li className="menuList text-[#6f6f6f] cursor-pointer p-2 flex items-center gap-2" onClick={handleAvatarClick}>
              {/* Avatar hoặc Icon người dùng */}
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-[35px] h-[35px] rounded-full border"
                />
              ) : (
                <FaUserCircle className="w-[35px] h-[35px] text-gray-500" />
              )}
            </li>
            {isDropdownVisible && (
              <div className="absolute top-[50px] right-0 bg-white border-2 border-gray-300 rounded-lg w-[250px] shadow-md p-4 z-9999">
                <div className="flex flex-col items-center gap-3 mb-4">
                  {/* Avatar lớn */}
                  {user.avatar ? (
                    <img
                      src={user.avatar || ''}
                      alt="User Avatar"
                      className="w-[80px] h-[80px] rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="w-[80px] h-[80px] rounded-full object-cover text-gray-500" />
                  )}
                  {/* Tên và email */}
                  <div className="text-center">
                    <h2 className="font-semibold">{user.name}</h2>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                {/* Các tính năng */}
                <ul className="space-y-2 items-center text-center">
                  {/* Link đến trang profile */}
                  <li>
                    <Link to="/profile" className="cursor-pointer text-gray-700 hover:text-blue-500 py-2">
                      Hồ sơ
                    </Link>
                  </li>

                  {/* Các mục khác trong dropdown */}
                  <li className="cursor-pointer text-gray-700 hover:text-blue-500 py-2">Cài đặt</li>
                  <li
                    className="cursor-pointer text-red-500 hover:text-red-600 flex items-center justify-center gap-2 py-2"
                    onClick={handleLogout}
                  >
                    <MdLogout className="text-lg" />
                    Đăng xuất
                  </li>
                  <li
                    className="cursor-pointer text-gray-700 hover:text-blue-500 py-2"
                    onClick={() => setIsDropdownVisible(false)}
                  >
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