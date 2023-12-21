import { LogEvent } from "@prisma/client"
import { z } from "zod"

export const logSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  event: z.nativeEnum(LogEvent),
  message: z.string(),
  userId: z.string(),
})
