require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectMongoDB = require('./db/connectDB');
const app = express();
const PORT = process.env.PORT || 5000;

const authRouter = require('./routes/auth-routes');
const adminRouter = require('./routes/admin');
const jobseekerRouter = require('./routes/jobseeker')
const recruiterRouter = require('./routes/recruiter')
// Cấu hình CORS
app.use(
    cors({
      origin: '*',
      methods: ["GET", "POST", "DELETE", "PUT"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
app.use(express.json({ limit: "5mb" }));    // chống ddos

// Middleware xử lý lỗi
app.use((err, req, res, next) => {  
    console.error(err);
    res.status(500).json({
        success: false,
        error: 'Something went wrong'
    });
});

// Routes xử lý request
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/jobseeker', jobseekerRouter);
app.use('/recruiter', recruiterRouter);
// Khởi động server
connectMongoDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
