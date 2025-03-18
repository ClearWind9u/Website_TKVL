const mongoose = require('mongoose');

const connectMongoDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("⚠️ MONGO_URI không được định nghĩa trong .env");
        }

        const conn = await mongoose.connect(process.env.MONGO_URI); 
        console.log(`MongoDB connected`);
    } catch (error) {
        console.error(`❌ Lỗi kết nối MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectMongoDB;
