"use client"

import Link from "next/link"

import { Menu } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { NAV_ITEMS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function MobileNav() {
  return (
    <div className="block md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>เมนู</SheetTitle>
          </SheetHeader>
          <div className="mt-8 flex flex-col space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  })
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
