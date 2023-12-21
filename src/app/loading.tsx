"use client"

import { useEffect, useState } from "react"

export default function LoadingPage() {
  const [dot, setDot] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDot((dot) => (dot + 1) % 4)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const dots = ".".repeat(dot)

  return (
    <div className="grid h-screen w-screen place-items-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="h-6 w-6 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.3s]" />
          <div className="h-6 w-6 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.15s]" />
          <div className="h-6 w-6 animate-bounce rounded-full bg-amber-400" />
        </div>
        <p className="text-lg">
          กรุณารอสักครู่
          <span>{dots}</span>
        </p>
      </div>
    </div>
  )
}
