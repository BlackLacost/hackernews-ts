import { PrismaClient, User } from '@prisma/client'
import { Request } from 'express'
import jwt from 'jsonwebtoken'

export interface TokenPayload {
  sub: number
}

export function getTokenFromReq(req: Request): string | null {
  const authorizationHeader = req.headers.authorization

  if (authorizationHeader) {
    const token = authorizationHeader.replace('Bearer ', '')
    return token
  }
  return null
}

export async function getUserFromReq(req: Request, prisma: PrismaClient): Promise<User | null> {
  const token = getTokenFromReq(req)

  if (token) {
    const payload = jwt.verify(token, 'super_secret')
    if (payload) {
      const user = await prisma.user.findUnique({ where: { id: Number(payload.sub) } })
      if (user) {
        return user
      }
    }
  }
  return null
}
