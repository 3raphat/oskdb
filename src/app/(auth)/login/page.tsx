import { Database } from "lucide-react"
import Balancer from "react-wrap-balancer"

import { LoginForm } from "@/app/(auth)/login/_components/login-form"

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Database className="mx-auto h-8 w-8" />
          <h1 className="text-3xl font-semibold">เข้าสู่ระบบ</h1>
          <Balancer className="mt-2 text-muted-foreground">
            กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ
          </Balancer>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
