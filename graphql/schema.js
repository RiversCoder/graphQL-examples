const graphql = require('graphql');
const {
  GraphQLObjectType, // 对象
  GraphQLString, // 字符串
  GraphQLID, // ID 类型
  GraphQLSchema, // schema (定义接口时使用)
  GraphQLInt, // int 类型
  GraphQLList, // list 数组类型
  GraphQLNonNull // non null 不能为空
} = graphql;
const Book  = require('../models/book.js');
const Author  = require('../models/author.js');


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
    authorId: { type: GraphQLString },
    author: { // 嵌套类型
      type: AuthorType,
      description: '当前书籍ID下的作者信息',
      resolve: (root, params) => {
        console.log(root)
        // return authorData.filter(v => v.id == root.authorId)[0]
        return Author.findById(root.authorId)
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
        return Book.find({authorId: root.id})
      }
    }
  })
})

// 定义查询 RootQuery
const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
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
        // return Book.findById(id)
        return Book.findById(id)
        // return bookData.filter( v => v.id == id )[0];
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
        return Author.findById(id)
      }
    },
    books:{
      type: new GraphQLList(BookType),
      description: '查询书籍列表',
      resolve: (root, params) => {
        return Book.find()
      }
    },
    authors:{
      type: new GraphQLList(AuthorType),
      description: '查询作者列表',
      resolve: (root, params) => {
        return Author.find()
      }
    }
  })
})

// 定义修改更新 RootMutation
const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  description: '更新新增数据',
  fields: () => ({
    addAuthor:{
        type: AuthorType,
        description: '新增作者信息',
        // 参数
        args: {
          name: { type: new GraphQLNonNull(GraphQLString) , description: '新增作者的名称' },
          age: { type: GraphQLInt, description: '新增作者的年龄' }
        },
        resolve: async (root, params) => {
          let result = null
          await Author.find({ name: params.name, age: params.age }, (err, doc) => {
                if(doc.length == 0){
                  let author = new Author({
                    name: params.name,
                    age: params.age
                  })
                  result = author.save()
                }
          });
          return result;
        }
    },
    addBook: {
      type: BookType,
      description: '新增书籍信息',
      // 参数
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) , description: '新增书籍名称' },
        genre: { type: GraphQLString, description: '新增书籍类型' },
        authorId: { type: GraphQLID, description: '新增书籍的作者ID' }
      },
      resolve: async (root, params) => {
        let result = null
        await Book.find({ name: params.name, genre: params.genre, authorId: params.authorId }, (err, doc) => {
              if(doc.length == 0){
                let book = new Book({
                  name: params.name,
                  genre: params.genre,
                  authorId: params.authorId
                })
                result = book.save()
              }
        });
        return result;
      }
    }
  })
})

// 定义导出 schema
module.exports = new GraphQLSchema({
  query: RootQuery, // query 定义查询类的接口
  mutation: RootMutation
});
