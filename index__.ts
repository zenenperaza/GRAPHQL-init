import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { GraphQLError } from "graphql"

import { v1 as uuid } from "uuid"


const users = [
    {
        id: 1,
        name: "Zenen Peraza",
        surname: "Gil",
        street: "Las mercedes",
        zipCode: 3001,
        city: "Barquisimeto",
        phone: "+584245034999"
    },
    {
        id: 2,
        name: "Alexis",
        surname: "Peraza",
        street: "El Triunfo",
        zipCode: 3001,
        city: "Cabudare",
        phone: "+584169556181"
    }
]

const typeDefs = `
    type User {
        id: ID!
        name: String!
        surname: String
        street: String
        zipCode: Int
        phone: String
        city: String
        address: String
    }
    type Query {
        allUsers: [User]
        userCount: Int! @deprecated(reason: "Us userLength instead.")
        userLength: Int!
        findUserByName(name:String!): User
        findUserById(id:ID!): User
    }
    type Mutation {
        addUser(
            name: String!
            surname: String!
            street: String!
            zipCode: Int!
            phone: String
            city: String!
        ): User
    }
`
const resolvers = {
    User: {
        address: (parent) => `${parent.street}, ${parent.zipCode}, ${parent.city}`
    },
    Query: {
        allUsers: () => users,
        userCount: () => users.length,
        findUserByName: (parent, args) =>  users.find( user => user.name === args.name),
        findUserById: (parent, args) =>  users.find( user => user.id === args.id)
    },
    Mutation: {
        addUser: (parent, args) => {
            if(users.find(user => user.name === args.name)){
                throw new GraphQLError('tue users already exists.', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                   
                })
            }
            const user = {...args, id: uuid()}
            users.push(user)
            return user
        }
    }
    

}



const server = new ApolloServer({
    typeDefs, resolvers
})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
})

 console.log(`Server ready at: ${url}`);
 