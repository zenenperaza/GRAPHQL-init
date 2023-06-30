import { makeExecutableSchema } from "@graphql-tools/schema"
import { create } from "domain"
import express from 'express'
import { createServer } from "http"
import { WebSocketServer } from "ws"
import { useServer } from "graphql-ws/lib/use/ws"
import { ApolloServer } from "@apollo/server"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import bodyParser from "body-parser"
import { expressMiddleware } from "@apollo/server/express4";
import { PubSub } from "graphql-subscriptions";
import mongoose, { Mongoose } from "mongoose"
import CommentMongoose from "./models/Comment.js"

const MONGODB = "mongodb+srv://zenenperaza:3317397jB.@curso-graphql.0eynqwo.mongodb.net/?retryWrites=true&w=majority"
const port = 4000

const typeDefs = `
    type Comment {
        name: String!
        endDate: String!
    }
    type Query {
        getComment(id:ID!):Comment
    }
    type Mutation {
        createComment(name: String!): String
    }
    type Subscription {
        commentCreated: Comment!
    }
    
    `
const pubSub = new PubSub()

const resolvers = {
    Query: {
       getComment: async (parent, {id}) => await CommentMongoose.findById(id)
    },
    Subscription: {
        commentCreated: {
            subscribe: () => pubSub.asyncIterator(['COMMENT_CREATED'])
        }
    },
    Mutation: {
        async createComment(parent, {name}){
            const endDate = new Date().toDateString()
            const newComment = new CommentMongoose({
                name: name,
                endDate: endDate
            })



            const response = await newComment.save()

            pubSub.publish('COMMENT_CREATED', { commentCreated: {
                name, endDate: new Date().toDateString()
            }})
            return `Comment: ${name} created`
        }
    }
}




const schema = makeExecutableSchema({typeDefs, resolvers})
const app = express() 
const httpServer = createServer(app)
const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql'
})
const wsServerCleanup = useServer({schema}, wsServer)
const apolloServer = new ApolloServer({
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({httpServer}), 
        {
            async serverWillStart(){
                return { async drainServer(){
                        await wsServerCleanup.dispose()
                    }
                }
            }
        }
    ]
})

await apolloServer.start()

app.use('/graphql', bodyParser.json(), expressMiddleware(apolloServer))

mongoose.set('strictQuery', false)
mongoose.connect(MONGODB)

httpServer.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}/graphql`)
})