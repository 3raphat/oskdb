import { logRouter } from "@/server/api/routers/log"
import { memberListRouter } from "@/server/api/routers/memberList"
import { memberPendingRouter } from "@/server/api/routers/memberPending"
import { postRouter } from "@/server/api/routers/post"
import { userRouter } from "@/server/api/routers/user"
import { createTRPCRouter } from "@/server/api/trpc"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  log: logRouter,
  memberPending: memberPendingRouter,
  memberList: memberListRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
