import { LogEvent } from "@prisma/client"
import * as z from "zod"

import { relatedUserSchema, type CompleteUser } from "./index"

export const logSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  event: z.nativeEnum(LogEvent),
  message: z.string(),
  userId: z.string(),
})

export interface CompleteLog extends z.infer<typeof logSchema> {
  user: CompleteUser
}

/**
 * relatedLogSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedLogSchema: z.ZodSchema<CompleteLog> = z.lazy(() =>
  logSchema.extend({
    user: relatedUserSchema,
  })
)
