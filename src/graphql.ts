import { hash, compare } from 'bcrypt'
import { gql, IResolvers } from 'apollo-server'
import { sign } from 'jsonwebtoken'
import { Context } from './index'

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    name: String!
    posts: [Post!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    author: User!
  }

  type Query {
    users: [User!]!
    posts: [Post!]!
  }

  type Mutation {
    signup(username: String!, password: String!, name: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    postCreate(title: String!, body: String!): Post!
  }
`
export const resolvers: IResolvers<any, Context> = {
  Query: {
    users: (_, __, { prisma }) => {
      return prisma.user.findMany()
    },

    posts: (_, __, { prisma }) => {
      return prisma.post.findMany()
    },
  },

  Mutation: {
    signup: async (_, { username, password, name }, { prisma }) => {
      const hashedPassword = await hash(password, 12)
      const user = await prisma.user.create({ data: { username, password: hashedPassword, name } })
      const token = sign({ sub: user.id }, 'super_secret')
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

      const token = sign({ sub: user.id }, 'super_secret')
      return {
        token,
        user,
      }
    },

    postCreate: async (_, { title, body }, { prisma, user }) => {
      const post = await prisma.post.create({
        data: {
          title,
          body,
          author: { connect: { id: user.id } },
        },
      })

      return post
    },
  },

  Post: {
    author: async (parent, __, { prisma }) => {
      const { authorId } = parent
      const author = await prisma.user.findUnique({ where: { id: authorId } })
      return author
    },
  },

  User: {
    posts: async (parent, __, { prisma }) => {
      return prisma.post.findMany({ where: { authorId: parent.id } })
    },
  },
}
