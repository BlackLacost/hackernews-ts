import { PrismaClient, User } from '@prisma/client'
import { ApolloServer } from 'apollo-server'
import { Request } from 'express'
import { getUserFromReq } from './auth.service'
import { resolvers, typeDefs } from './graphql'

const prisma = new PrismaClient()

const server = new ApolloServer({
  resolvers,
  typeDefs,
  context: async ({ req }) => {
    const user = await getUserFromReq(req, prisma)
    return {
      req,
      prisma,
      user,
    }
  },
})
server.listen({ port: 5000 }).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})

export interface Context {
  req: Request
  prisma: PrismaClient
  user: User
}
