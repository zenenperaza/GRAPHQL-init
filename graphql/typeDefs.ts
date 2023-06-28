export const typeDefs = `
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
    }
`;
