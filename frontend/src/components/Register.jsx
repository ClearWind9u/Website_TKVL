import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthday: "",
    address: "",
    role: "jobseeker",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (Object.values(formData).some((value) => value === "")) {
      console.log(formData);
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/auth/register", {
        userName: formData.name,
        userEmail: formData.email,
        password: formData.password,
        role: "jobseeker",
      });

      if (response.data.success) {
        setSuccess("Đăng ký thành công! Vui lòng đăng nhập");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg flex w-[900px]">
        {/* Phần Form */}
        <div className="flex-1 pr-8">
          <h1 className="text-5xl font-bold text-white mb-2" style={{ WebkitTextStroke: "0.25px black" }}>Tìm việc
          </h1>
          <p className="text-xl mb-6">đi bé ơi, không là bốc cớt ăn đó</p>
          <h2 className="text-xl font-semibold mb-4">Đăng ký tài khoản</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Họ và tên" className="w-full p-2 border rounded" onChange={handleChange} />
            <input type="email" name="email" placeholder="Email (xxxxx@gmail.com)" className="w-full p-2 border rounded" onChange={handleChange} />
            <input type="text" name="birthday" placeholder="Ngày tháng năm sinh (DD/MM/YYYY)" className="w-full p-2 border rounded" onChange={handleChange} />
            <div className="flex gap-2">
              <input type="text" name="address" placeholder="Địa chỉ" className="flex-1 p-2 border rounded" onChange={handleChange} />
              
            </div>
            <input type="password" name="password" placeholder="Mật khẩu" className="w-full p-2 border rounded" onChange={handleChange} />
            <input type="password" name="confirmPassword" placeholder="Xác nhận mật khẩu" className="w-full p-2 border rounded" onChange={handleChange} />
            <div className="flex items-center gap-2">
              <input type="checkbox" name="agree" onChange={handleChange} />
              <label className="text-sm text-gray-600">
                Tôi đã đọc và đồng ý với
                <a href="/terms" className="text-blue-500 hover:underline mx-1" target="_blank" rel="noopener noreferrer">
                  Điều khoản dịch vụ
                </a>
                và
                <a href="/privacy" className="text-blue-500 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                  Chính sách bảo mật
                </a>
                của ITJOBSearch.
              </label>
            </div>
            <button type="submit" className="w-full bg-black text-white py-2 rounded">Đăng ký</button>
          </form>
        </div>
        {/* Phần Ảnh */}
        <div className="flex-1 flex items-center justify-center">
          <img src="./register.png" alt="Đăng ký" className="max-w-full max-h-full object-contain rounded-3xl border" />
        </div>
      </div>
    </div>
  );
};

export default Register;