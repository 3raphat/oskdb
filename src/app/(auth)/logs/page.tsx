import { columns } from "@/app/(auth)/logs/_components/columns"
import { DataTable } from "@/components/data-table/data-table"
import { PageHeader } from "@/components/page-header"
import { api } from "@/trpc/server"

async function getData() {
  const data = await api.log.getAll.query()
  return data
}

export default async function LogsPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <PageHeader
        heading="ประวัติการเข้าใช้งาน"
        text="เข้าสู่ระบบ, ออกจากระบบ, สร้างบัญชีผู้ดูแลระบบ"
      />
      <DataTable columns={columns} data={data} />
    </div>
  )
}
