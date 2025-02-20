import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = ({ login }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    birthday: "",
    gender: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.name || !formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Giả lập đăng ký thành công
    setSuccess(true);

    setTimeout(() => {
      navigate("/login"); // Chuyển hướng đến trang đăng nhập
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Đăng ký tài khoản</h1>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Đăng ký thành công! Đang chuyển hướng...</p>}
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* Họ và Tên */}
        <div>
          <label className="block font-semibold mb-1">Họ và Tên:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block font-semibold mb-1">Mật khẩu:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Ngày sinh */}
        <div>
          <label className="block font-semibold mb-1">Ngày sinh:</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Giới tính */}
        <div>
          <label className="block font-semibold mb-1">Giới tính:</label>
          <div className="space-x-4">
            <label>
              <input
                type="radio"
                name="gender"
                value="Nam"
                onChange={handleChange}
              />{" "}
              Nam
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Nữ"
                onChange={handleChange}
              />{" "}
              Nữ
            </label>
          </div>
        </div>

        {/* Nút Đăng ký */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
};

export default Register;