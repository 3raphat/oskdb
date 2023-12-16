import Link from "next/link"

import { History, LogOut, UserPlus2 } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getServerAuthSession } from "@/server/auth"

export async function UserDropdown() {
  const session = await getServerAuthSession()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {(session?.user.username ?? "Unknown").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <p className="p-2 font-medium">{session?.user.username}</p>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/signup">
            <UserPlus2 className="mr-2 h-4 w-4" />
            <span>สร้างบัญชีผู้ดูแลระบบ</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/logs">
            <History className="mr-2 h-4 w-4" />
            <span>ประวัติการเข้าใช้งาน</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/api/auth/signout">
            <LogOut className="mr-2 h-4 w-4" />
            <span>ออกจากระบบ</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
