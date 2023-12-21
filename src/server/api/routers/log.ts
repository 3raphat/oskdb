import { logSchema } from "@/lib/validation/log"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

export const logRouter = createTRPCRouter({
  create: protectedProcedure
    .input(logSchema.pick({ event: true, message: true }))
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
