import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = ({ user, logout }) => {
  const navigate = useNavigate();

  return (
    <nav className="navBar flex justify-between items-center p-4 bg-white shadow-md">
      {/* Logo */}
      <div className="logoDiv flex items-center gap-4">
        <img src="/logo.png" alt="Logo" className="w-[50px] h-[50px]" />
        <h1 className="text-2xl font-bold">
          <span className="text-blue-500">ITJOB</span>
          <span className="text-gray-700">Search</span>
        </h1>
      </div>

      {/* Menu */}
      <div className="menu flex gap-6">
        <Link to="/" className="text-gray-700 px-4 py-2 hover:text-blue-500">
          Trang chủ
        </Link>

        {user ? (
          // Nếu đã đăng nhập, hiển thị avatar + menu dropdown
          <div className="relative group">
            <button className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/40" // Avatar demo
                alt="Avatar"
                className="w-[40px] h-[40px] rounded-full border"
              />
              <span className="text-gray-700 font-medium">{user.name}</span>
            </button>

            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Hồ sơ cá nhân
              </Link>
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
          // Nếu chưa đăng nhập, hiển thị nút đăng nhập và đăng ký
          <>
            <Link
              to="/login"
              className="text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;