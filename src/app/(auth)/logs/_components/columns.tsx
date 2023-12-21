"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { type z } from "zod"

import { type logSchema } from "@/lib/validation/log"

type Log = z.infer<typeof logSchema>

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
