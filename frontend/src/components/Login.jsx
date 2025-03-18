import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ login }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Dữ liệu user giả lập
  const fakeUsers = {
    jobseeker: {
      id: 1,
      name: "Nguyễn Văn A",
      email: "jobseeker@gmail.com",
      password: "123",
      role: "jobseeker",
    },
    recruiter: {
      id: 2,
      name: "Công ty XYZ",
      email: "recruiter@gmail.com",
      password: "456",
      role: "recruiter",
    },
    admin: {
      id: 3,
      name: "Quản lí",
      email: "admin@gmail.com",
      password: "789",
      role: "admin",
    },
  };

  const handleLogin = (e) => {
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

    // Kiểm tra xác thực tài khoản theo vai trò đã chọn
    const user = fakeUsers[role];
    if (user && email === user.email && password === user.password) {
      login(user);
      navigate(role === "jobseeker" ? "/jobseeker" : "/recruiter");
    } else {
      setError("Email, mật khẩu hoặc vai trò không đúng!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-[900px] h-[500px]">
        {/* Phần Form */}
        <div className="pr-8 float-left w-1/2">
          <h1 className="text-5xl font-bold text-white mb-2" style={{ WebkitTextStroke: "0.25px black" }}>Tìm việc</h1>
          <p className="text-xl mb-6">đi bé ơi, không là bốc cớt ăn đó</p>
          <h2 className="text-xl font-semibold mb-4">Đăng nhập</h2>

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <input
              type="text"
              name="email"
              placeholder="Email (xxxxx@gmail.com)"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Chọn Role */}
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

            {/* Nút Đăng nhập */}
            <button type="submit" className="w-full bg-black text-white py-2 rounded">
              Đăng nhập
            </button>
          </form>
        </div>

        {/* Phần Ảnh */}
        <div className="absolute top-0 right-0 w-1/2 h-full">
          <img src="./login.jpg" alt="Đăng nhập" className="w-full h-full object-cover rounded-3xl border" />
        </div>
      </div>
    </div>
  );
};

export default Login;
