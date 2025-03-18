import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Import axios

const Login = ({ login }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu!");
      return;
    }

    if (role === "") {
      setError("Vui lòng chọn vai trò của bạn!");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ.");
      return 
    }

    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        userEmail: email,
        password: password,
        role: role,
      });

      if (response.data.success) {
        const { accessToken, user } = response.data.data;

        // Lưu token vào localStorage
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(user));

        // Gọi hàm `login` để cập nhật trạng thái người dùng
        login(user);

        // Điều hướng theo vai trò
        navigate(user.role === "jobseeker" ? "/jobseeker" : "/recruiter");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg flex w-[900px] h-[400px]">
        <div className="flex-1 pr-8">
          <h1 className="text-5xl font-bold text-white mb-2" style={{ WebkitTextStroke: "0.25px black" }}>Tìm việc</h1>
          <p className="text-xl mb-6">đi bé ơi, không là bốc hơi</p>
          <h2 className="text-xl font-semibold mb-4">Đăng nhập</h2>

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              name="email"
              placeholder="Email (xxxxx@gmail.com)"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <select
              className="w-full p-2 border rounded bg-white"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Chọn vai trò</option>
              <option value="jobseeker">Người tìm việc</option>
              <option value="recruiter">Nhà tuyển dụng</option>
              <option value="admin">Quản trị viên</option>
            </select>
            <button type="submit" className="w-full bg-black text-white py-2 rounded">Đăng nhập</button>
          </form>
        </div>
        <div className="flex-1">
          <img src="./login.jpg" alt="Đăng nhập" className="w-full h-full object-cover rounded-3xl border" />
        </div>
      </div>
    </div>
  );
};

export default Login;
