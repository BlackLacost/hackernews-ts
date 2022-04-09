import { PrismaClient, Prisma, User, Role } from '@prisma/client'
import { ApolloServer, AuthenticationError } from 'apollo-server'
import { Request } from 'express'
import { getUserFromReq } from './auth.service'
import { resolvers, typeDefs } from './graphql'

const prisma = new PrismaClient()

const server = new ApolloServer({
  resolvers,
  typeDefs,
  context: async ({ req }) => {
    type UserWithRoles = Prisma.PromiseReturnType<typeof getUserFromReq>
    let user: UserWithRoles = null
    try {
      user = await getUserFromReq(req, prisma)
    } catch (err) {
      throw new AuthenticationError('You provide incorrect token!')
    }

    const hasRole = (role: 'ADMIN' | 'USER') => {
      return user?.roles.some((r) => r.role.value === role)
    }

    return { req, prisma, user, hasRole }
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
