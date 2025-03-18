require('dotenv').config();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidator } = require('../../validations/auth');

const registerUser = async (req, res) => {
    const { error } = registerValidator(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { name, email, password, birth, address } = req.body;
    const missingFields = [];
    ['name', 'email', 'password', 'birth', 'address'].forEach(field => {
        if (!req.body[field]) missingFields.push(field)
    });
    if (!email || !password || !birth || !address) return res.status(400).json({ message: 'Please fill all fields', missingFields });
    const role = "jobseeker";
    const existingUser = await User.findOne({ email });
    if(existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    try {   
        const user = new User({ name,email,birth,address,role,password:hashedPassword });
        await user.save();
        return res.status(201).json({
            success: true,
            message: 'User created successfully',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req,res) => {
    const {email, password} = req.body;
    const existingUser = await User.findOne({email})
    const checkPassword = await bcrypt.compare(password, existingUser.password);
    if(!existingUser)
    {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials',
        });
    }


    if (!checkPassword) {
        return res.status(401).json({
            success: false,
            message: 'Email or password is incorrect',
        });
    }

    const accessToken = jwt.sign({
        _id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role
    }, process.env.JWT_SECRET, {expiresIn: '360m'})

    res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: {
            accessToken,
            user: {
                _id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role
            }
        }
    })
}

module.exports = { registerUser, loginUser };