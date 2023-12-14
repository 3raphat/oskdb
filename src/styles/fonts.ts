import { Anuphan, Sarabun } from "next/font/google"

export const sans = Anuphan({
  subsets: ["thai"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  // solve for "Failed to find font override values for font `Anuphan`"
  display: "swap",
  adjustFontFallback: false,
})

export const body = Sarabun({
  subsets: ["thai"],
  variable: "--font-body",
  weight: ["300", "400", "500", "700"],
})
