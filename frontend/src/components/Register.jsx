import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthday: "",
    address: "",
    city: "",
    role: "",
    password: "",
    confirmPassword: "",
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

    if (Object.values(formData).some((value) => value === "" || value === false)) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    navigate("/login");
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
              <select name="city" className="p-2 border rounded" onChange={handleChange}>
                <option value="">Tỉnh thành</option>
                <option value="An Giang">An Giang</option>
                <option value="Bà Rịa - Vũng Tàu">Bà Rịa - Vũng Tàu</option>
                <option value="Bắc Giang">Bắc Giang</option>
                <option value="Bắc Kạn">Bắc Kạn</option>
                <option value="Bạc Liêu">Bạc Liêu</option>
                <option value="Bắc Ninh">Bắc Ninh</option>
                <option value="Bến Tre">Bến Tre</option>
                <option value="Bình Định">Bình Định</option>
                <option value="Bình Dương">Bình Dương</option>
                <option value="Bình Phước">Bình Phước</option>
                <option value="Bình Thuận">Bình Thuận</option>
                <option value="Cà Mau">Cà Mau</option>
                <option value="Cần Thơ">Cần Thơ</option>
                <option value="Cao Bằng">Cao Bằng</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Đắk Lắk">Đắk Lắk</option>
                <option value="Đắk Nông">Đắk Nông</option>
                <option value="Điện Biên">Điện Biên</option>
                <option value="Đồng Nai">Đồng Nai</option>
                <option value="Đồng Tháp">Đồng Tháp</option>
                <option value="Gia Lai">Gia Lai</option>
                <option value="Hà Giang">Hà Giang</option>
                <option value="Hà Nam">Hà Nam</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Hà Tĩnh">Hà Tĩnh</option>
                <option value="Hải Dương">Hải Dương</option>
                <option value="Hải Phòng">Hải Phòng</option>
                <option value="Hậu Giang">Hậu Giang</option>
                <option value="Hòa Bình">Hòa Bình</option>
                <option value="Hưng Yên">Hưng Yên</option>
                <option value="Khánh Hòa">Khánh Hòa</option>
                <option value="Kiên Giang">Kiên Giang</option>
                <option value="Kon Tum">Kon Tum</option>
                <option value="Lai Châu">Lai Châu</option>
                <option value="Lâm Đồng">Lâm Đồng</option>
                <option value="Lạng Sơn">Lạng Sơn</option>
                <option value="Lào Cai">Lào Cai</option>
                <option value="Long An">Long An</option>
                <option value="Nam Định">Nam Định</option>
                <option value="Nghệ An">Nghệ An</option>
                <option value="Ninh Bình">Ninh Bình</option>
                <option value="Ninh Thuận">Ninh Thuận</option>
                <option value="Phú Thọ">Phú Thọ</option>
                <option value="Phú Yên">Phú Yên</option>
                <option value="Quảng Bình">Quảng Bình</option>
                <option value="Quảng Nam">Quảng Nam</option>
                <option value="Quảng Ngãi">Quảng Ngãi</option>
                <option value="Quảng Ninh">Quảng Ninh</option>
                <option value="Quảng Trị">Quảng Trị</option>
                <option value="Sóc Trăng">Sóc Trăng</option>
                <option value="Sơn La">Sơn La</option>
                <option value="Tây Ninh">Tây Ninh</option>
                <option value="Thái Bình">Thái Bình</option>
                <option value="Thái Nguyên">Thái Nguyên</option>
                <option value="Thanh Hóa">Thanh Hóa</option>
                <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
                <option value="Tiền Giang">Tiền Giang</option>
                <option value="TP.HCM">TP.HCM</option>
                <option value="Trà Vinh">Trà Vinh</option>
                <option value="Tuyên Quang">Tuyên Quang</option>
                <option value="Vĩnh Long">Vĩnh Long</option>
                <option value="Vĩnh Phúc">Vĩnh Phúc</option>
                <option value="Yên Bái">Yên Bái</option>
              </select>
            </div>
            <input type="password" name="password" placeholder="Mật khẩu" className="w-full p-2 border rounded" onChange={handleChange} />
            <input type="password" name="confirmPassword" placeholder="Xác nhận mật khẩu" className="w-full p-2 border rounded" onChange={handleChange} />
            <select name="role" className="w-full p-2 border rounded" onChange={handleChange}>
              <option value="">Chọn vai trò</option>
              <option value="jobseeker">Người tìm việc</option>
              <option value="recruiter">Nhà tuyển dụng</option>
              <option value="admin">Quản trị viên</option>
            </select>
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