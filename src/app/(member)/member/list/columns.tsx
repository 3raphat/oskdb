"use client"

import Link from "next/link"

import { type ColumnDef } from "@tanstack/react-table"
import { type z } from "zod"

import { ButtonSort } from "@/components/data-table/button-sort"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { type memberSchema } from "@/lib/validation/member"

export type Member = z.infer<typeof memberSchema>

export const columns: ColumnDef<Member>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "memberid",
    header: ({ column }) => {
      return <ButtonSort column={column}>เลขที่สมาชิก</ButtonSort>
    },
  },
  {
    accessorKey: "osk_id",
    header: ({ column }) => {
      return <ButtonSort column={column}>เลขประจำตัวนักเรียน</ButtonSort>
    },
  },
  {
    accessorKey: "prefix_name",
    header: "คำนำหน้าชื่อ",
  },
  {
    accessorKey: "namet",
    header: ({ column }) => {
      return <ButtonSort column={column}>ชื่อ</ButtonSort>
    },
  },
  {
    accessorKey: "surnamet",
    header: ({ column }) => {
      return <ButtonSort column={column}>นามสกุล</ButtonSort>
    },
  },
  {
    accessorKey: "oskgeneration",
    header: ({ column }) => {
      return <ButtonSort column={column}>รุ่นที่</ButtonSort>
    },
  },
  {
    accessorKey: "address",
    header: "ที่อยู่",
  },

  {
    accessorKey: "changwat_tname",
    header: "จังหวัด",
  },
  {
    accessorKey: "picture",
    header: "รูปภาพ",
    cell: ({ row }) => {
      const picture = row.original.picture!
      return (
        <Avatar>
          <AvatarImage src={picture} alt="member" />
        </Avatar>
      )
    },
  },
  {
    id: "edit_btn",
    header: "แก้ไข",
    cell: ({ row }) => {
      return <Link href={`/member/edit/${row.original.memberid}`}>แก้ไข</Link>
    },
  },
]
