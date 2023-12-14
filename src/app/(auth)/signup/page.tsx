import { Database } from "lucide-react"
import Balancer from "react-wrap-balancer"

import { SignUpForm } from "@/app/(auth)/signup/_components/signup-form"
import { BackButton } from "@/components/back-button"

export default function SignUpPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <BackButton position="top-left" />
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Database className="mx-auto h-8 w-8" />
          <h1 className="text-3xl font-semibold">สร้างบัญชีใหม่</h1>
          <Balancer className="mt-2 text-muted-foreground">
            ใช้ชื่อผู้ใช้งานและรหัสผ่านที่ต้องการ
            และไม่ควรใช้ชื่อผู้ใช้งานที่ซ้ำกัน
          </Balancer>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}
