import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ login }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Dữ liệu user giả lập
  const fakeUser = {
    id: 1,
    name: "test",
    email: "test@gmail.com",
    password: "123",
    role: "jobseeker",
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu!");
      return;
    }

    // Kiểm tra xác thực tài khoản
    if (email === fakeUser.email && password === fakeUser.password) {
      login(fakeUser); // Cập nhật trạng thái đăng nhập
      navigate("/jobseeker"); // Chuyển hướng sau khi login
    } else {
      setError("Email hoặc mật khẩu không đúng!"); // Hiển thị lỗi
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Đăng nhập</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin} className="w-full space-y-4">
        {/* Email */}
        <div>
          <label className="block font-semibold mb-1">Email:</label>
          <input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block font-semibold mb-1">Mật khẩu:</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Nút Đăng nhập */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default Login;
