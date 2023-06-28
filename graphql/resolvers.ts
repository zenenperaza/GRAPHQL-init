import fetch from 'node-fetch'

export const resolvers = {
    User: {
        address: (parent) => `${parent.street}, ${parent.zipCode}, ${parent.city}`
    },
    Query: {
        allUsers: async () => {
            const url = "http://localhost:8055/items/users"
            const rawResponse = await fetch(url)
            const response = await rawResponse.json()
            return response.data
           }
        }

    }
