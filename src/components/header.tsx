import Link from "next/link"

import { Database } from "lucide-react"

import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserDropdown } from "@/components/user-dropdown"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex w-full items-center justify-between">
          <Link
            className="flex flex-1 items-center justify-start space-x-2"
            href="/"
          >
            <Database className="h-6 w-6" />
            <h1 className="hidden text-xl font-semibold md:block">OSK DB</h1>
          </Link>
          <div className="flex shrink-0 items-center justify-center">
            <MainNav />
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <ThemeToggle />
            <UserDropdown />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}
