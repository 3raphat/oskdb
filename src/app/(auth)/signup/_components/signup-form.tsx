"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
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
import { signUpSchema } from "@/lib/validation/auth"
import { api } from "@/trpc/react"

type FormValues = z.infer<typeof signUpSchema>

export function SignUpForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  })

  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      toast.success("สร้างบัญชีผู้ใช้สำเร็จแล้ว")
      form.reset()
    },
    onError: (error) => {
      switch (error.message) {
        case "CONFLICT": {
          form.setError("username", {
            message: error.message,
          })
        }
      }
    },
  })

  const createLog = api.log.create.useMutation()

  function onSubmit(values: Omit<FormValues, "confirmPassword">) {
    createUser.mutate({
      username: values.username,
      password: values.password,
    })
    createLog.mutate({
      event: "CREATE",
      message: `สร้างบัญชีผู้ใช้ ${values.username}`,
    })
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ยืนยันรหัสผ่าน</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          isLoading={createUser.isLoading}
        >
          สร้างบัญชีผู้ใช้
        </Button>
      </form>
    </Form>
  )
}
