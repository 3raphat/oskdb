import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcryptjs"
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { logInSchema } from "@/lib/validation/auth"
import { db } from "@/server/db"

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      // ...other properties
      // role: UserRole;
      username: string
    } & DefaultSession["user"]
  }

  interface User {
    username: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username: string
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
        username: token.username,
      },
    }),
    jwt: ({ token, user }) => {
      if (user) {
        token.username = user.username
      }
      return token
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "username",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const parsedCredentials = logInSchema.safeParse(credentials)

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data

          const user = await db.user.findFirst({
            where: {
              username,
            },
          })

          if (!user) throw new Error("ไม่พบชื่อผู้ใช้")

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          const isPasswordValid = await bcrypt.compare(password, user.password)

          if (!isPasswordValid) throw new Error("รหัสผ่านไม่ถูกต้อง")

          return user
        }
        return null
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions)
