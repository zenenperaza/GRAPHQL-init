import { makeExecutableSchema } from "@graphql-tools/schema"
import { create } from "domain"
import express from 'express'
import { createServer } from "http"
import { WebSocketServer } from "ws"

const port = 4000

const typeDefs = `


`

const resolvers = {

}




const schema = makeExecutableSchema({typeDefs, resolvers})
const app = express() 
const httpServer = createServer(app)
const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql'
})