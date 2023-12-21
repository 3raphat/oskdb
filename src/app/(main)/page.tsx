import { PageHeader } from "@/components/page-header"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <PageHeader
        heading="คู่มือการใช้งานระบบ"
        text="คู่มือการใช้งานระบบ สำหรับผู้ดูแลระบบ"
      />
      <div className="grid h-[500px] w-full place-items-center rounded-lg border">
        พื้นที่สำหรับใส่คู่มือ
      </div>
    </div>
  )
}
