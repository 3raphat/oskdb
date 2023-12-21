import { RegistrationState } from "@prisma/client"
import { TRPCError } from "@trpc/server"

import { memberRegistrationSchema } from "@/lib/validation/member"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

export const memberListRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      memberRegistrationSchema.pick({
        id: true,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const exists = await ctx.db.memberList.findFirst({
        where: {
          memberid: input.id,
        },
      })

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "ข้อมูลสมาชิกนี้มีอยู่แล้ว",
        })
      }

      const member = await ctx.db.memberRegistration.findUnique({
        where: {
          id: input.id,
        },
      })

      if (!member) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "ไม่พบข้อมูลสมาชิกนี้",
        })
      }
      console.log(member.registration_state)

      if (member.registration_state !== RegistrationState.APPROVED) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "สมาชิกนี้ยังไม่ได้รับการอนุมัติ",
        })
      }
      console.log(member.registration_state)

      return ctx.db.memberList.create({
        data: {
          memberid: member.id,
          prefix_name: member.prefix_name,
          namet: member.name_th,
          surnamet: member.surname_th,
          osk_id: member.osk_id,
          changwat_tname: member.province,
          address: [
            member.address_number,
            member.alley,
            member.road,
            member.sub_district,
            member.district,
            member.province,
            member.postalcode,
          ].join(" "),
        },
      })
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.memberList.findMany()
  }),
})
