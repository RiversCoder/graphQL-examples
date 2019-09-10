const graphql = require('graphql');
const {
  GraphQLObjectType, // 对象
  GraphQLString, // 字符串
  GraphQLID, // ID 类型
  GraphQLSchema, // schema (定义接口时使用)
  GraphQLInt, // int 类型
  GraphQLList, // list 数组类型
} = graphql;

// 定义一些假数据
const bookData = [
  {id:1, name:'《大话西游》', genre:"喜剧/搞笑", authorId: 1},
  {id:2, name:'《一千零一夜》', genre:"童话/儿童", authorId: 2},
  {id:3, name:'《斗罗大陆》', genre:"玄幻/小说", authorId: 3},
  {id:4, name:'《我真的不想出名》', genre:"都市/小说", authorId: 3},
  {id:5, name:'《雪鹰领主》', genre:"仙侠/小说", authorId: 1},
  {id:6, name:'《盘龙》', genre:"奇幻/小说", authorId: 1},
  {id:7, name:'《武道乾坤》', genre:"玄幻/小说", authorId: 2},
];
const authorData = [
  {id:1, name:'我吃西红柿', age:43},
  {id:2, name:'天蚕土豆', age:38},
  {id:3, name:'唐家三少', age:39}
];

// 定义 BookType 返回书籍信息的对象数据结构
const BookType = new GraphQLObjectType({
  name: 'Book',    // 可作为对象的全局唯一名称
  description: 'Book Response Type', // 对象的描述，养成好习惯，一般都需要备注好描述 description
  fields: () => ({  // 是解析函数，也就是定义具体数据结构, 该对象包含什么键值
    id: { type: GraphQLID, description: 'This\'s is a book id.'},
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: { // 嵌套类型
      type: AuthorType,
      resolve: (root, params) => {
        console.log(root)
        return authorData.filter(v => v.id == root.authorId)[0]
      }
    }
  })
})

// 定义 AuthorType 返回作者信息的对象数据结构
const AuthorType = new GraphQLObjectType({
  name: 'Author',    // 可作为对象的全局唯一名称
  description: 'Author Response Type', // 对象的描述，养成好习惯，一般都需要备注好描述 description
  fields: () => ({  // 是解析函数，也就是定义具体数据结构, 该对象包含什么键值
    id: { type: GraphQLID, description: 'This\'s is a author id.' },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      description: '当前作者ID下的所有书籍列表',
      resolve: (root, params) => {
        console.log(root)
        return bookData.filter(v => v.authorId == root.id)
      }
    }
  })
})

// 定义查询 RootQuery
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    // 查询类型接口方法名称
    book:{
      type: BookType,
      description: '书籍相关信息查询',
      // // 定义接口传参的数据结构
      args: {
        id: { type: GraphQLID , description: '参数是书籍的ID' }
      },
      resolve: (root, params, context) => {
        // 获取参数 从数据库获取相关信息，返回给客户端
        const { id } = params;
        return bookData.filter( v => v.id == id )[0];
      }
    },
    author:{
      type: AuthorType,
      description: '作者相关信息描述',
      args:{
        id: { type: GraphQLID, description: '参数：作者的ID' }
      },
      resolve: (root, params, context) => {
        // 获取参数 从数据库获取相关信息，返回给客户端
        const { id } = params;
        return authorData.filter( v => v.id == id )[0];
      }
    },
    books:{
      type: new GraphQLList(BookType),
      description: '查询书籍列表',
      resolve: (root, params) => {
        return bookData
      }
    },
    authors:{
      type: new GraphQLList(AuthorType),
      description: '查询作者列表',
      resolve: (root, params) => {
        return authorData
      }
    }
  })
})

// 定义导出 schema
module.exports = new GraphQLSchema({
  query: RootQuery // query 定义查询类的接口
});
