const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    title: String,
    salary: String,
    location: String,
    experience: String,
    description: String,
    requirement: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}); 
module.exports = mongoose.model('Article', UserSchema);