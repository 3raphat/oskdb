import * as z from "zod"

import {
  relatedAccountSchema,
  relatedLogSchema,
  relatedSessionSchema,
  type CompleteAccount,
  type CompleteLog,
  type CompleteSession,
} from "./index"

export const userSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  username: z.string(),
  password: z.string(),
  createdAt: z.date(),
  email: z.string().nullish(),
  emailVerified: z.date().nullish(),
  image: z.string().nullish(),
})

export interface CompleteUser extends z.infer<typeof userSchema> {
  accounts: CompleteAccount[]
  sessions: CompleteSession[]
  log: CompleteLog[]
}

/**
 * relatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() =>
  userSchema.extend({
    accounts: relatedAccountSchema.array(),
    sessions: relatedSessionSchema.array(),
    log: relatedLogSchema.array(),
  })
)
