import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server'
import { resolvers, typeDefs } from './graphql'

const prisma = new PrismaClient()

const server = new ApolloServer({
  resolvers,
  typeDefs,
  context: {
    prisma,
  },
})
server.listen({ port: 5000 }).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
