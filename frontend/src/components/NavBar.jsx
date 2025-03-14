import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = ({ user, logout }) => {
  const navigate = useNavigate();

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
        <Link to="/jobs" className="hover:text-black">Công việc</Link>
        <Link to="/status" className="hover:text-black">Trạng thái</Link>
        <Link to="/favorites" className="hover:text-black">Yêu thích</Link>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="relative group">
            <button className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/40"
                alt="Avatar"
                className="w-[35px] h-[35px] rounded-full border"
              />
              <span className="text-gray-700 font-medium">{user.name}</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Hồ sơ cá nhân</Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-black">Đăng nhập</Link>
            <Link to="/register" className="px-4 py-2 bg-black text-white rounded-md">Đăng ký</Link>
            <Link to="/employer" className="px-4 py-2 border border-gray-400 rounded-md hover:bg-gray-100">Nhà tuyển dụng</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;