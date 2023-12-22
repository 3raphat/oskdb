"use client"

import { type ColumnDef } from "@tanstack/react-table"
import {
  MoreHorizontal,
  Trash2,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react"
import { type z } from "zod"

import { ButtonSort } from "@/components/data-table/button-sort"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type memberRegistrationSchema } from "@/lib/validation/member"
import { api } from "@/trpc/react"

export type Member = z.infer<typeof memberRegistrationSchema>

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "id",
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
    accessorKey: "name_th",
    header: ({ column }) => {
      return <ButtonSort column={column}>ชื่อ</ButtonSort>
    },
  },
  {
    accessorKey: "surname_th",
    header: ({ column }) => {
      return <ButtonSort column={column}>นามสกุล</ButtonSort>
    },
  },
  {
    id: "address",
    header: "ที่อยู่",
    cell: ({ row }) => {
      const {
        address_number,
        alley,
        road,
        sub_district,
        district,
        province,
        postalcode,
      } = row.original
      return (
        <>
          {[
            address_number,
            alley,
            road,
            sub_district,
            district,
            province,
            postalcode,
          ].join(" ")}
        </>
      )
    },
  },
  {
    accessorKey: "status",
    header: "สถานะ",
    cell: ({ row }) => {
      const status = row.original.status
      switch (status) {
        case "ALIVE":
          return "ยังมีชีวิตอยู่"
        case "DECEASED":
          return "ถึงแก่กรรม"
        case "LOST":
          return "ขาดการติดต่อ"
      }
    },
  },
  {
    accessorKey: "tel",
    header: "เบอร์โทรศัพท์",
  },
  {
    accessorKey: "image_url",
    header: "รูปภาพ",
    cell: ({ row }) => {
      const image_url = row.original.image_url!
      return (
        <Avatar>
          <AvatarImage src={image_url} alt="member" />
        </Avatar>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const member = row.original
      const updateState = api.memberPending.updateState.useMutation()
      const deleteMember = api.memberPending.delete.useMutation()
      const createMemberList = api.memberList.create.useMutation()

      async function handleApproved() {
        await updateState
          .mutateAsync({
            id: member.id,
            registration_state: "APPROVED",
          })
          .then(() => {
            // push to main table
            createMemberList.mutate({
              id: member.id,
            })
          })
      }

      function handleRejected() {
        updateState.mutate({
          id: member.id,
          registration_state: "REJECTED",
        })
      }

      function handleDeleted() {
        deleteMember.mutate({ id: member.id })
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleApproved()}>
              <UserRoundCheck className="mr-2 h-4 w-4" />
              อนุมัติ
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRejected()}>
              <UserRoundX className="mr-2 h-4 w-4" />
              ปฏิเสธ
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDeleted()}>
              <Trash2 className="mr-2 h-4 w-4" />
              ลบออกจากฐานข้อมูล
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
