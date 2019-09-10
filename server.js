/*
  国内文档地址：
    https://graphql.cn/ 《GraphQL 中文官网》
    https://www.cnblogs.com/Wolfmanlq/p/9094418.html 《GraphQL 入门介绍》
    http://www.siyuweb.com/mysql/3259.html 《入门GraphQL+express+mysql 项目完整demo》
    https://www.jianshu.com/p/eea37394a13b 《node基于express的GraphQL API服务器》
    https://www.jianshu.com/p/8ecb9e381a8a 《GraphQl深入讲解和Express集成》
    https://segmentfault.com/a/1190000015564754 《同学，GraphQL了解一下：实践篇》
*/
const express = require('express');
const expressGraphql = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./graphql/schema');

const app = express();

// 连接 mongoose
mongoose.connect('mongodb://127.0.0.1:27017/', { useNewUrlParser: true, useUnifiedTopology: true } );
mongoose.connection.once('open',() => {
  console.log('connceted to database.')
});

// 中间件
app.use('/graphql', expressGraphql(req => {
  return {
    schema,
    graphiql: true
  }
}))

// 监听端口
app.listen(4000, (err) => {
  console.log('start server in port 4000');
});
