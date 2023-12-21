"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { logInSchema } from "@/lib/validation/auth"

type FormValues = z.infer<typeof logInSchema>

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(logInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: values.username,
        password: values.password,
      })

      if (result?.ok) {
        router.push("/")
      }

      if (result?.error === "ไม่พบชื่อผู้ใช้") {
        form.setError("username", {
          message: result.error,
        })
      } else if (result?.error === "รหัสผ่านไม่ถูกต้อง") {
        form.setError("password", {
          message: result.error,
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อผู้ใช้</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>รหัสผ่าน</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" isLoading={isLoading}>
          เข้าสู่ระบบ
        </Button>
      </form>
    </Form>
  )
}
