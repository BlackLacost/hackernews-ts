import { hash, compare } from 'bcrypt'
import { gql, IResolvers } from 'apollo-server'
import { sign } from 'jsonwebtoken'
import { Context } from './context.interface'

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    name: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User!]
  }

  type Mutation {
    signup(username: String!, password: String!, name: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
  }
`
export const resolvers: IResolvers<any, Context> = {
  Query: {
    users: (_, __, { prisma }) => {
      return prisma.user.findMany()
    },
  },
  Mutation: {
    signup: async (_, { username, password, name }, { prisma }) => {
      const hashedPassword = await hash(password, 12)
      const user = await prisma.user.create({ data: { username, password: hashedPassword, name } })
      const token = sign({ userId: user.id }, 'super_secret')
      return {
        token,
        user,
      }
    },

    login: async (_, args, { prisma }) => {
      const user = await prisma.user.findUnique({ where: { username: args.username } })
      if (!user) {
        throw new Error('Credential error')
      }

      const valid = await compare(args.password, user.password)
      if (!valid) {
        throw new Error('Credential error')
      }

      const token = sign({ userId: user.id }, 'super_secret')
      return {
        token,
        user,
      }
    },
  },
}
