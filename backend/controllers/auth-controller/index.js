require('dotenv').config();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const registerUser = async (req, res) => {
    const { userName, userEmail, password, role } = req.body;
    const existingUser = await User.findOne({ $or: [{ userName }, { userEmail }] });
    if(existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    try {   
        const user = new User({ userName,userEmail,role,password:hashedPassword });
        await user.save();
        return res.status(201).json({
            success: true,
            message: 'User created successfully',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { userEmail, password, role } = req.body; // ✅ Nhận role từ request
    try {
        const existingUser = await User.findOne({ userEmail });
        
        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: "Email không tồn tại!",
            });
        }
        
        // ✅ Kiểm tra mật khẩu
        console.log("Body: ", req.body);
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Mật khẩu không đúng!",
            });
        }

        // ✅ So sánh role từ request với role trong database
        if (existingUser.role !== role) {
            return res.status(403).json({
                success: false,
                message: "Sai vai trò! Vui lòng chọn đúng vai trò.",
            });
        }

        // ✅ Tạo access token
        const accessToken = jwt.sign(
            {
                _id: existingUser._id,
                userName: existingUser.userName,
                userEmail: existingUser.userEmail,
                role: existingUser.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "360m" }
        );

        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",
            data: {
                accessToken,
                user: {
                    _id: existingUser._id,
                    userName: existingUser.userName,
                    userEmail: existingUser.userEmail,
                    role: existingUser.role,
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi server!",
        });
    }
};

module.exports = { registerUser, loginUser };