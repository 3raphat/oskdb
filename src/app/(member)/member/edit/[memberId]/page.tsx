import { notFound } from "next/navigation"

import { UpdateForm } from "@/app/(member)/member/edit/[memberId]/update-form"
import { PageHeader } from "@/components/page-header"
import { api } from "@/trpc/server"

interface PageProps {
  params: {
    memberId: number
  }
}

export default async function Page({ params: { memberId } }: PageProps) {
  const memberData = await api.memberList.getById.query({ id: memberId })
  if (!memberData) return notFound()

  return (
    <div className="container mx-auto py-10">
      <PageHeader heading={`แก้ไขข้อมูลสมาชิก: เลขที่ ${memberId}`} />
      <UpdateForm defaultValue={memberData} />
    </div>
  )
}
