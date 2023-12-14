"use client"

import { useRouter } from "next/navigation"

import { ChevronLeft } from "lucide-react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BackButtonProps extends ButtonProps {
  position?: "top-left" | "top-right"
}

export function BackButton({ position, ...props }: BackButtonProps) {
  const router = useRouter()
  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className={cn(
        position === "top-left" && "absolute left-4 top-4 md:left-8 md:top-8",
        position === "top-right" && "absolute right-4 top-4 md:right-8 md:top-8"
      )}
      {...props}
    >
      <ChevronLeft className="mr-2 h-4 w-4" />
      ย้อนกลับ
    </Button>
  )
}
