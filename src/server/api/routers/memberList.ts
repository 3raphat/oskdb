import { RegistrationState } from "@prisma/client"
import { TRPCError } from "@trpc/server"

import { memberRegistrationSchema, memberSchema } from "@/lib/validation/member"
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

      if (member.registration_state !== RegistrationState.APPROVED) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "สมาชิกนี้ยังไม่ได้รับการอนุมัติ",
        })
      }

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
          picture: member.image_url,
        },
      })
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.memberList.findMany()
  }),

  getById: protectedProcedure
    .input(memberRegistrationSchema.pick({ id: true }))
    .query(({ ctx, input }) => {
      return ctx.db.memberList.findFirst({
        where: {
          memberid: input.id,
        },
      })
    }),

  update: protectedProcedure
    .input(memberSchema)
    .mutation(async ({ ctx, input }) => {
      const member = await ctx.db.memberList.findUnique({
        where: {
          memberid: input.memberid,
        },
      })

      if (!member) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "ไม่พบข้อมูลสมาชิกนี้",
        })
      }

      return ctx.db.memberList.update({
        where: {
          memberid: input.memberid,
        },
        data: {
          osk_id: input.osk_id,
          namet: input.namet,
          surnamet: input.surnamet,
          oskgeneration: input.oskgeneration,
          address: input.address,
          prefix_name: input.prefix_name,
          changwat_tname: input.changwat_tname,
          picture: input.picture,
          tel: input.tel,
          mobile: input.mobile,
          fax: input.fax,
          status_id: input.status_id,
        },
      })
    }),
})
