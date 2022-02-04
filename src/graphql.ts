import { gql, IResolvers } from 'apollo-server'
import { Context } from './context.interface'

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    name: String!
  }

  type Query {
    users: [User!]
  }

  type Mutation {
    userCreate(username: String!, password: String!, name: String!): User!
  }
`
export const resolvers: IResolvers<any, Context> = {
  Query: {
    users: (_, __, { prisma }) => {
      return prisma.user.findMany()
    },
  },
  Mutation: {
    userCreate: (_, args, { prisma }) => {
      return prisma.user.create({ data: { ...args } })
    },
  },
}
