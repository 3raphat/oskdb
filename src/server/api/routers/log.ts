import { z } from "zod"

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

export const logRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        event: z.enum(["login", "logout", "create"]),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.log.create({
        data: {
          event: input.event,
          message: input.message,
          user: { connect: { id: ctx.session.user.id } },
        },
      })
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.log.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    })
  }),
})
