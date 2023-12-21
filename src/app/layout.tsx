import "@/styles/globals.css"

import { cookies } from "next/headers"

import { Providers } from "@/components/providers"
import { cn } from "@/lib/utils"
import { body, sans } from "@/styles/fonts"
import { TRPCReactProvider } from "@/trpc/react"

export const metadata = {
  title: "OSK DB",
  description: "Database for OSK",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          sans.variable,
          body.variable
        )}
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          <Providers>{children}</Providers>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
