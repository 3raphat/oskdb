"use client"

import { type PropsWithChildren } from "react"

import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster
        closeButton
        richColors
        style={{
          fontFamily: "var(--font-sans)",
        }}
      />
      {children}
    </ThemeProvider>
  )
}
