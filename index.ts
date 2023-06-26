import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"

const books = [
    {
        id: 1,
        title: 'titulo Libro 1',
        author: 'Zenen Peraza'
    },
    {
        id: 2,
        title: 'titulo Libro 2',
        author: 'Alexis Gil'
    }
]

const typeDefs = `
    type Book {
        id:ID!
        title: String
        author: String
    }
    type Query{
        books: [Book]
        book(id:ID!): Book
    }
`

const resolvers = {
    Query: {
        books: () => books,
        book: (parent, args) => books.find((book) => book.id === parseInt(args.id))
    }
}

const server = new ApolloServer({
    typeDefs, resolvers
})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
})

 console.log(`Server ready at: ${url}`);
 