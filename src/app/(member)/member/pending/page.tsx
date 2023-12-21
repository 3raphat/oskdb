import { columns, type Member } from "@/app/(member)/member/pending/columns"
import { DataTable } from "@/components/data-table/data-table"
import { PageHeader } from "@/components/page-header"
import { api } from "@/trpc/server"

async function getData(): Promise<Member[]> {
  const data = await api.memberPending.getAll.query()
  return data
}

export default async function Page() {
  const data = await getData()
  return (
    <div className="mx-auto px-8 py-10">
      <PageHeader
        heading="รายชื่อที่รอการอนุมัติ"
        text="รายชื่อสมาชิกที่ยังไม่ได้รับการอนุมัติ โปรดตรวจสอบข้อมูลให้ถูกต้องก่อนกดปุ่มอนุมัติ"
      />
      <DataTable columns={columns} data={data} />
    </div>
  )
}
