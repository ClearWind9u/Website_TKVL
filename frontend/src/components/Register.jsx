import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthday: "",
    address: "",
    city: "",
    agree: false,
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!formData.name || !formData.email || !formData.birthday || !formData.address || !formData.city || !formData.agree) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg flex w-[900px]">
        {/* Phần Form */}
        <div className="flex-1 pr-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tìm việc đi</h1>
          <p className="text-gray-500 mb-6">bé ơi, không là bốc cớt ăn đó</p>
          <h2 className="text-xl font-semibold mb-4">Đăng ký tài khoản</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Họ và tên" className="w-full p-2 border rounded" onChange={handleChange} />
            <input type="email" name="email" placeholder="xxxxx@gmail.com" className="w-full p-2 border rounded" onChange={handleChange} />
            <input type="text" name="birthday" placeholder="XX/XX/XXXX" className="w-full p-2 border rounded" onChange={handleChange} />
            <div className="flex gap-2">
              <input type="text" name="address" placeholder="Địa chỉ" className="flex-1 p-2 border rounded" onChange={handleChange} />
              <select name="city" className="p-2 border rounded" onChange={handleChange}>
                <option value="">Tỉnh thành</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="TP.HCM">TP.HCM</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="agree" onChange={handleChange} />
              <label className="text-sm text-gray-600">Tôi đã đọc và đồng ý với Điều khoản dịch vụ và Chính sách bảo mật</label>
            </div>
            <button type="submit" className="w-full bg-black text-white py-2 rounded">Đăng ký</button>
          </form>
        </div>

        {/* Phần Ảnh */}
        <div className="flex-1">
          <img src="../public/register.png" alt="Đăng ký" className="w-full h-full object-cover rounded-lg border" />
        </div>
      </div>
    </div>
  );
};

export default Register;