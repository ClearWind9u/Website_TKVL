import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineBell} from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';
import { MdLogout } from "react-icons/md";
import { Link } from 'react-router-dom';  // Import Link để điều hướng giữa các trang

const NavBar = ({ role, setRole }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Quản lý việc hiển thị box thông tin người dùng

  const [isLoggedIn, setIsLoggedIn] = useState(true); // Quản lý trạng thái đăng nhập, mặc định là chưa đăng nhập
  const [userInfo, setUserInfo] = useState({
    avatar: '/vnglogo.png', // URL avatar người dùng (nếu có), có thể thay thế bằng ảnh thật
    name: 'Nguyễn Văn A',
    email: 'user@example.com'  // Email người dùng (chỉ khi đăng nhập)
  });

  const handleSwitchToUser = () => {
    setRole('user'); 
  };

  const handleAvatarClick = () => {
    setIsDropdownVisible(!isDropdownVisible); // Khi nhấp vào avatar, toggle (hiển thị/ẩn) dropdown
  };

  const handleLogout = () => {
    // Xử lý đăng xuất tại đây
    alert("Bạn đã đăng xuất!");
    setIsLoggedIn(false); // Cập nhật trạng thái đăng xuất
    setIsDropdownVisible(false); // Ẩn dropdown khi đăng xuất
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
    setIsOpen(!isOpen); // Mở/đóng danh sách thông báo
  };
    

  return (
    <div className='navBar flex flex-wrap justify-between items-center p-[2rem] w-[90%] m-auto '>
      {/* Logo và Thanh chọn */}
      <div className="logoDiv flex items-center gap-4 w-full sm:w-auto">
       <img src="/logo.png" alt="Logo" className="logofinal w-[70px] h-[70px]" />
        <h1 className="logo text-[25px]">
          <span className="job-text">ITJOB</span><span className="search-text">Search</span>
        </h1>
      </div>
  
      {/* Menu */}
      <div className='menu flex gap-8 sm:w-full md:w-auto sm:flex-col md:flex-row'>
        <Link to="/" className="menuList text-[#6f6f6f] hover:text-white hover:bg-black hover:rounded-[20px] text-[17px] text-black p-2">Trang chủ</Link>
        <Link to="/create" className="menuList text-[#6f6f6f] hover:text-white hover:bg-black hover:rounded-[20px] text-[17px] text-black p-2">Tạo công việc</Link>
        <Link to="/job" className="menuList text-[#6f6f6f] hover:text-white hover:bg-black hover:rounded-[20px] text-[17px] text-black p-2">Công việc</Link>
        <Link to="/candidate" className="menuList text-[#6f6f6f] hover:text-white hover:bg-black hover:rounded-[20px] text-[17px] text-black p-2">Ứng viên</Link>
        {!isLoggedIn ? (
          // Chưa đăng nhập
          <>
            <li className="menuList text-[#6f6f6f] text-blue-500 hover:text-white hover:bg-black hover:rounded-[20px]  p-2"><strong>Đăng nhập/Đăng ký</strong></li>
            <li className="menuList text-[#6f6f6f] border-2 border-black rounded-[20px] hover:text-white hover:bg-black hover:rounded-[17px] text-black p-2"
            onClick={handleSwitchToUser}>Người dùng</li>
          </>
        ) : (
          // Sau đăng nhập
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
              <img
                src={userInfo.avatar || ''}  // Nếu có avatar thì dùng, nếu không thì dùng FaUserCircle
                alt="User Avatar"
                className="w-[30px] h-[30px] rounded-full object-cover"
                style={{ objectFit: 'cover' }}
              />
              {/* Nếu không có avatar, hiển thị icon mặc định */}
              {!userInfo.avatar && <FaUserCircle className="text-[#6f6f6f] text-[25px]" />}
            </li>
          </>
        )}

        {/* Box thông tin người dùng (hiển thị khi nhấp vào avatar) */}
        {isLoggedIn && isDropdownVisible && (
        <div className="absolute top-[50px] right-0 bg-white border-2 border-gray-300 rounded-lg w-[250px] shadow-md p-4 z-9999">
          <div className="flex flex-col items-center gap-3 mb-4">
            {/* Avatar lớn */}
            <img
              src={userInfo.avatar || ''} 
              alt="User Avatar"
              className="w-[80px] h-[80px] rounded-full object-cover"
            />
            {/* Tên và email */}
            <div className="text-center">
              <h2 className="font-semibold">{userInfo.name}</h2>
              <p className="text-sm text-gray-500">{userInfo.email}</p>
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
              onClick={() => setIsDropdownVisible(false)} // Ẩn dropdown khi click vào "Thoát"
            >
              Thoát
            </li>
          </ul>
          
        </div>
      )}
      </div>
    </div>
  )
}

export default NavBar
