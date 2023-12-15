"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { th } from "date-fns/locale"

type Log = {
  id: string
  createdAt: Date
  event: string
  message: string
  user: {
    username: string
  }
}

export const columns: ColumnDef<Log>[] = [
  {
    accessorKey: "createdAt",
    header: "วันที่",
    accessorFn: (row) => format(row.createdAt, "PPpp", { locale: th }),
  },
  {
    accessorKey: "user.username",
    header: "ชื่อผู้ใช้",
  },
  {
    accessorKey: "event",
    header: "เหตุการณ์",
  },
  {
    accessorKey: "message",
    header: "ข้อความ",
  },
]
