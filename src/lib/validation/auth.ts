import { z } from "zod"

export const logInSchema = z.object({
  username: z
    .string({
      required_error: "กรุณากรอกชื่อผู้ใช้",
    })
    .min(1, {
      message: "กรุณากรอกชื่อผู้ใช้",
    }),
  password: z
    .string({
      required_error: "กรุณากรอกรหัสผ่าน",
    })
    .min(1, {
      message: "กรุณากรอกรหัสผ่าน",
    })
    .min(3, {
      message: "รหัสผ่านต้องมีความยาวอย่างน้อย 3 ตัวอักษร",
    }),
})

export const signUpSchema = logInSchema
  .extend({
    confirmPassword: z
      .string({
        required_error: "กรุณากรอกรหัสผ่านอีกครั้ง",
      })
      .min(1, {
        message: "กรุณากรอกรหัสผ่านอีกครั้ง",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  })
