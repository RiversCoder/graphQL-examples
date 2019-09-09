const graphql = require('graphql');
const {
  GraphQLObjectType, // 对象
  GraphQLString, // 字符串
  GraphQLID, // ID 类型
  GraphQLSchema // schema (定义接口时使用)
} = graphql;

// 定义 BookType 返回书籍的数据结构
const BookType = new GraphQLObjectType({
  name: 'Book',    // 可作为对象的全局唯一名称
  description: '', // 对象的描述，养成好习惯，一般都需要备注好描述 description
  fields: () => ({  // 是解析函数，也就是定义具体数据结构, 该对象包含什么键值
    id: { type: GraphQLID, description: 'This\'s is a book id.' },
    name: { type: GraphQLString },
    genre: { type: GraphQLString }
  })
})

// 定义查询 RootQuery
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    book:{
      type: BookType,
      description: 'Object类型数据查询例子',
      // // 定义接口传参的数据结构
      args: {
        id: { type: GraphQLID , description: '参数是书籍的ID' }
      },
      resolve: (root, params, context) => {

        // 定义一些假数据 测试专用
        const data = [
          {id:1, name:'《大话西游》', genre:"喜剧/搞笑"},
          {id:2, name:'《一千零一夜》', genre:"童话/儿童"},
          {id:3, name:'《斗罗大陆》', genre:"玄幻/小说"}
        ];

        // 获取参数 从数据库获取相关信息，返回给客户端
        const { id } = params;
        return data.filter( v => v.id == id )[0];
      }
    }
  })
})


// 定义导出 schema
module.exports = new GraphQLSchema({
  query: RootQuery // query 定义查询类的接口
});
