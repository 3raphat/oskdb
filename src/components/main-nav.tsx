"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { NAV_ITEMS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()
  return (
    <div className="hidden md:block">
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "transition-colors hover:text-foreground/90",
              pathname.startsWith(item.href)
                ? "text-foreground"
                : "text-foreground/70"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}
