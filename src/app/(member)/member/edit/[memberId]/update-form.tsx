"use client"

import { useState } from "react"
import Image from "next/image"

import { zodResolver } from "@hookform/resolvers/zod"
import { ImageIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { type z } from "zod"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { Label } from "@/components/ui/label"
import { memberSchema } from "@/lib/validation/member"
import { api } from "@/trpc/react"

type FormValues = z.infer<typeof memberSchema>

export function UpdateForm({ defaultValue }: { defaultValue: FormValues }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      ...defaultValue,
    },
  })

  // update main table
  const updateMemberList = api.memberList.update.useMutation({
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(values: FormValues) {
    try {
      setIsLoading(true)
      toast.promise(updateMemberList.mutateAsync(values), {
        loading: "กำลังอัปเดตข้อมูลสมาชิก",
        success: "อัปเดตข้อมูลสมาชิกสำเร็จ",
        error: "อัปเดตข้อมูลสมาชิกไม่สำเร็จ",
      })
      console.log(values)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="memberid"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>เลขที่สมาชิก</FormLabel>
              <FormControl>
                <Input {...field} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="osk_id"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>เลขประจำตัวนักเรียน</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="oskgeneration"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>รุ่นที่</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="prefix_name"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>คำนำหน้าชื่อ</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="namet"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>ชื่อ</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="surnamet"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>นามสกุล</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>ที่อยู่</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>ที่อยู่</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="changwat_tname"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>จังหวัด</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Alert>
          <ImageIcon className="h-4 w-4" />
          <AlertTitle>ขั้นตอนการอัพโหลดรูปภาพใหม่</AlertTitle>
          <AlertDescription>
            <ol className="list-inside list-decimal">
              <li>
                ไปที่{" "}
                <a
                  href="https://uploadthing.com/dashboard"
                  target="_blank"
                  className="underline"
                >
                  https://uploadthing.com/dashboard
                </a>
              </li>
              <li>อัพโหลดรูปภาพใหม่ให้เรียบร้อย</li>
              <li>ลบรูปภาพเดิม (optional)</li>
              <li>
                คัดลอกลิงค์รูปภาพอันใหม่ (รูปที่อัพโหลดใหม่จะอยู่ด้านบนเสมอ)
              </li>
              <li>
                วางลิงค์รูปภาพใหม่ลงในช่อง{" "}
                <span className="font-semibold">รูปภาพ</span> ด้านล่างนี้
              </li>
            </ol>
          </AlertDescription>
        </Alert>
        <FormField
          control={form.control}
          name="picture"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>รูปภาพ</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <Label>Preview รูปเก่า</Label>
          {defaultValue.picture ? (
            <Image src={defaultValue.picture} alt="" width={150} height={150} />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200">
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-gray-400">ไม่มีรูป</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" isLoading={isLoading}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}
