import {
  MemberStatus,
  RegistrationState,
  RegistrationType,
} from "@prisma/client"
import { z } from "zod"

import { validThaiNationalID } from "@/lib/utils"

export const memberSchema = z.object({
  memberid: z.coerce.number().int(),
  osk_id: z.string().nullish(),
  namet: z.string(),
  surnamet: z.string().nullish(),
  oskgeneration: z.string().nullish(),
  address: z.string().nullish(),
  prefix_name: z.string().nullish(),
  changwat_tname: z.string().nullish(),
  picture: z.string().nullish(),
  tel: z.string().nullish(),
  mobile: z.string().nullish(),
  fax: z.string().nullish(),
  status_id: z.coerce.number().nullish(),
})

export const memberRegistrationSchema = z.object({
  id: z.coerce.number().int(),
  createdAt: z.coerce.date(),
  registration_type: z.nativeEnum(RegistrationType),
  registration_state: z.nativeEnum(RegistrationState).default("PENDING"),

  prefix_name: z.string().nullish(),
  name_th: z.string(),
  surname_th: z.string(),
  name_en: z.string().nullish(),
  surname_en: z.string().nullish(),
  old_name: z.string().nullish(),
  old_surname: z.string().nullish(),
  citizen_id: z
    .string()
    .min(13)
    .regex(/^[0-9]*$/, { message: "เลขประจำตัวประชาชนต้องเป็นตัวเลขเท่านั้น" })
    .refine((val) => validThaiNationalID(val), "เลขประจำตัวประชาชนมั่วซั่ว"),
  birthdate: z.coerce.date().nullish(),
  sk_since_year: z
    .string()
    .regex(/^[0-9]*$/)
    .nullish(),
  sk_until_year: z
    .string()
    .regex(/^[0-9]*$/)
    .nullish(),
  generation: z.string().regex(/^[0-9]*$/),
  osk_id: z.string().regex(/^[0-9]*$/),
  status: z.nativeEnum(MemberStatus),

  address_number: z.string().nullish(),
  alley: z.string().nullish(),
  road: z.string().nullish(),
  sub_district: z.string().nullish(),
  district: z.string().nullish(),
  province: z.string().nullish(),
  postalcode: z.string().nullish(),
  mobile: z
    .string()
    .regex(/^[0-9]*$/)
    .nullish(),
  tel: z
    .string()
    .regex(/^[0-9]*$/)
    .nullish(),
  email: z.string().email().nullish(),
  line_id: z.string().nullish(),

  workplace: z.string().nullish(),
  work_address_number: z.string().nullish(),
  building: z.string().nullish(),
  work_alley: z.string().nullish(),
  work_road: z.string().nullish(),
  work_sub_district: z.string().nullish(),
  work_district: z.string().nullish(),
  work_province: z.string().nullish(),
  work_postalcode: z.string().nullish(),
  work_tel: z
    .string()
    .regex(/^[0-9]*$/)
    .nullish(),
  work_fax: z
    .string()
    .regex(/^[0-9]*$/)
    .nullish(),
})
