import { type PropsWithChildren } from "react"

import { Header } from "@/components/header"

export default function LogsLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">{children}</div>
    </div>
  )
}
