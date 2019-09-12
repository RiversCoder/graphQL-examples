const mongoose = require('mongoose');

// 定义表结构
const AuthorSchema = mongoose.Schema({
    name: String,
    age: Number
})

module.exports = mongoose.model('Author', AuthorSchema);
