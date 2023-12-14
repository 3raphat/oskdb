import { TRPCError } from "@trpc/server"
import bcrypt from "bcryptjs"

import { logInSchema } from "@/lib/validation/auth"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

export const userRouter = createTRPCRouter({
  create: protectedProcedure
    .input(logInSchema)
    .mutation(async ({ ctx, input }) => {
      const { username, password } = input

      const exists = await ctx.db.user.findFirst({
        where: {
          username,
        },
      })

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "ชื่อผู้ใช้นี้มีอยู่แล้ว",
        })
      }

      return ctx.db.user.create({
        data: {
          username: username,
          password: bcrypt.hashSync(password, 10),
        },
      })
    }),
})
