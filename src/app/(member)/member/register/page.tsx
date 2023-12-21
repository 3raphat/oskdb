import { RegisterForm } from "@/app/(member)/member/register/_components/register-form"
import { PageHeader } from "@/components/page-header"

export default function Page() {
  return (
    <div className="container mx-auto py-10">
      <PageHeader
        heading="ลงทะเบียนสมาชิกใหม่"
        text="กรุณากรอกข้อมูลให้ครบถ้วน"
      />
      <RegisterForm />
    </div>
  )
}
