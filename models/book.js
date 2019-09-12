const mongoose = require('mongoose');

// 定义表结构
const BookSchema = mongoose.Schema({
    name: String,
    genre: String,
    authorId: String
})

module.exports = mongoose.model('Book', BookSchema);
