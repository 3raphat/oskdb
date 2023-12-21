import { TRPCError } from "@trpc/server"

import { memberRegistrationSchema } from "@/lib/validation/member"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

export const memberPendingRouter = createTRPCRouter({
  create: protectedProcedure
    .input(memberRegistrationSchema)
    .mutation(async ({ ctx, input }) => {
      const exists = await ctx.db.memberRegistration.findFirst({
        where: {
          id: input.id,
        },
      })

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "ข้อมูลสมาชิกนี้มีอยู่แล้ว",
        })
      }

      return ctx.db.memberRegistration.create({
        data: {
          ...input,
        },
      })
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.memberRegistration.findMany({
      where: {
        registration_state: "PENDING",
      },
    })
  }),

  updateState: protectedProcedure
    .input(
      memberRegistrationSchema.pick({
        id: true,
        registration_state: true,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const exists = await ctx.db.memberRegistration.findFirst({
        where: {
          id: input.id,
        },
      })

      if (!exists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "ไม่พบข้อมูลสมาชิกนี้",
        })
      }

      return ctx.db.memberRegistration.update({
        where: {
          id: input.id,
        },
        data: {
          registration_state: input.registration_state,
        },
      })
    }),

  delete: protectedProcedure
    .input(
      memberRegistrationSchema.pick({
        id: true,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const exists = await ctx.db.memberRegistration.findFirst({
        where: {
          id: input.id,
        },
      })

      if (!exists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "ไม่พบข้อมูลสมาชิกนี้",
        })
      }

      return ctx.db.memberRegistration.delete({
        where: {
          id: input.id,
        },
      })
    }),
})
