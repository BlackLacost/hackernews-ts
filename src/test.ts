import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// const role = 'ADMIN'

const start = async () => {
  const roleValue = Prisma.validator<Prisma.RoleArgs>()({
    select: { value: true },
  })
  type RoleValue = Prisma.RoleGetPayload<typeof roleValue>
  const blacklacostUser = await prisma.user.findUnique({
    where: { username: 'blacklacost' },
    include: { roles: { include: { role: true } } },
  })
  console.log(blacklacostUser?.roles.some((role) => role.role.value === ''))
}

start().catch((err) => console.log(err))
