import { columns, type Member } from "@/app/(member)/member/list/columns"
import { DataTable } from "@/components/data-table/data-table"
import { PageHeader } from "@/components/page-header"
import { api } from "@/trpc/server"

async function getData(): Promise<Member[]> {
  const data = await api.memberList.getAll.query()
  return data
}

export default async function Page() {
  const data = await getData()
  return (
    <div className="mx-auto px-8 py-10">
      <PageHeader
        heading="รายชื่อสมาชิก"
        text="แสดงรายชื่อของสมาชิกทั้งหมดในฐานข้อมูล ที่ผ่านการอนุมัติ"
      />

      <DataTable columns={columns} data={data} />
    </div>
  )
}
