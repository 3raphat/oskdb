"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

import { zodResolver } from "@hookform/resolvers/zod"
import { MemberStatus, RegistrationType } from "@prisma/client"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import {
  ThailandAddressTypeahead,
  ThailandAddressValue,
} from "react-thailand-address-typeahead"
import { toast } from "sonner"
import { type z } from "zod"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input, inputVariants } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { memberRegistrationSchema } from "@/lib/validation/member"
import { api } from "@/trpc/react"
import { useUploadThing } from "@/utils/uploadthing"

import { FormSection } from "./form-section"

type FormValues = z.infer<typeof memberRegistrationSchema>

export function RegisterForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(memberRegistrationSchema),
  })

  const [address, setAddress] = useState<ThailandAddressValue>(
    ThailandAddressValue.empty()
  )
  const [workAddress, setWorkAddress] = useState<ThailandAddressValue>(
    ThailandAddressValue.empty()
  )

  const createMember = api.memberPending.create.useMutation({
    onSuccess: () => {
      toast.success("ลงทะเบียนสำเร็จ")
    },
    onError: (error) => {
      switch (error.data?.code) {
        case "CONFLICT": {
          form.setError(
            "id",
            { type: "exist", message: error.message },
            { shouldFocus: true }
          )
        }
      }
    },
  })

  const updateImage = api.memberPending.updateImageUrl.useMutation()

  const [isLoading, setIsLoading] = useState(false)

  const [image, setImage] = useState<File>()
  const [previewImage, setPreviewImage] = useState("")

  const { startUpload } = useUploadThing("imageUploader")

  useEffect(() => {
    if (image) {
      setPreviewImage(URL.createObjectURL(image))
    }
  }, [image])

  async function onSubmit(values: FormValues) {
    try {
      setIsLoading(true)

      values.sub_district = address.subdistrict
      values.district = address.district
      values.province = address.province
      values.postalcode = address.postalCode

      values.work_sub_district = workAddress.subdistrict
      values.work_district = workAddress.district
      values.work_province = workAddress.province
      values.work_postalcode = workAddress.postalCode

      await createMember.mutateAsync(values).then(async () => {
        if (image) {
          toast.promise(
            startUpload([image]).then(
              (res) => {
                if (res?.[0]) {
                  values.image_url = res[0].url
                  // update url to db
                  updateImage.mutate({
                    id: values.id,
                    image_url: values.image_url,
                  })
                }
              },
              (error) => {
                console.error(error)
              }
            ),
            {
              loading: "กำลังอัพโหลดรูปภาพ",
              success: "อัพโหลดรูปภาพสำเร็จ",
              error: "เกิดข้อผิดพลาดขณะอัปโหลด",
            }
          )
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormSection title="ข้อมูลส่วนตัว">
          <div className="flex justify-between">
            <div>
              <FormField
                control={form.control}
                name="registration_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ประเภทการสมัคร</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={RegistrationType.LIFETIME} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            ตลอดชีพ (500 บาท)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={RegistrationType.HONORARY} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            สมาชิกกิตติมศักดิ์
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-start space-x-4">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ทะเบียนสมาชิกเลขที่</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="createdAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div>
                        <FormLabel>วันที่</FormLabel>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: th })
                              ) : (
                                <span>เลือกวันที่</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            fromYear={1900}
                            toYear={2200}
                            captionLayout="dropdown-buttons"
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div>
              <FormField
                control={form.control}
                name="image_url"
                render={() => (
                  <FormItem>
                    <FormLabel>รูปภาพ</FormLabel>
                    {image && previewImage && (
                      <Image
                        src={previewImage}
                        alt={image.name}
                        width={150}
                        height={150}
                      />
                    )}
                    <FormControl>
                      <Input
                        required
                        type="file"
                        onChange={(e) => setImage(e.target.files![0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="citizen_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>เลขประจำตัวประชาชน</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          </div>
          <div className="flex w-full space-x-4">
            <FormField
              control={form.control}
              name="prefix_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>คำนำหน้าชื่อ</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full flex-col space-y-2">
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="name_th"
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
                  name="surname_th"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>นามสกุล</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="name_en"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>ชื่อ (ภาษาอังกฤษ)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="surname_en"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>นามสกุล (ภาษาอังกฤษ)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <p>กรณีเปลี่ยนชื่อ (ถ้ามี)</p>
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="old_name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>ชื่อเดิม</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="old_surname"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>นามสกุลเดิม</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-start space-x-4">
            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div>
                    <FormLabel>วันเกิด</FormLabel>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: th })
                          ) : (
                            <span>เลือกวันที่</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={field.onChange}
                        fromYear={1900}
                        toYear={2200}
                        captionLayout="dropdown-buttons"
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="w-[280px]">
                  <FormLabel>สถานะ</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={MemberStatus.ALIVE}>
                        ยังมีชีวิตอยู่
                      </SelectItem>
                      <SelectItem value={MemberStatus.DECEASED}>
                        ถึงแก่กรรม
                      </SelectItem>
                      <SelectItem value={MemberStatus.LOST}>
                        ขาดการติดต่อ
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <p>เคยเป็น นร. โรงเรียนสวนกุหลาบวิทยาลัย</p>
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="sk_since_year"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>เข้า พ.ศ.</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sk_until_year"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>ออก พ.ศ.</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="generation"
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
        </FormSection>

        <FormSection title="ที่อยู่">
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="address_number"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>บ้านเลขที่</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alley"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>ซอย</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="road"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>ถนน</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex space-x-4">
            <ThailandAddressTypeahead
              value={address}
              onValueChange={(val) => setAddress(val)}
            >
              <FormField
                control={form.control}
                name="sub_district"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>ตำบล / แขวง</FormLabel>
                    <FormControl>
                      <ThailandAddressTypeahead.SubdistrictInput
                        className={cn(inputVariants())}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>อำเภอ / เขต</FormLabel>
                    <FormControl>
                      <ThailandAddressTypeahead.DistrictInput
                        className={cn(inputVariants())}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>จังหวัด</FormLabel>
                    <FormControl>
                      <ThailandAddressTypeahead.ProvinceInput
                        className={cn(inputVariants())}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalcode"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>รหัสไปรษณีย์</FormLabel>
                    <FormControl>
                      <ThailandAddressTypeahead.PostalCodeInput
                        className={cn(inputVariants())}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ThailandAddressTypeahead.Suggestion
                key={address.subdistrict}
                containerProps={{
                  className: cn(
                    "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
                  ),
                }}
                optionItemProps={{
                  className: cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors"
                  ),
                }}
              />
            </ThailandAddressTypeahead>
          </div>
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>มือถือ</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tel"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>โทร</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="line_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>LINE ID</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>อีเมล</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection title="ที่ทำงาน">
          <FormField
            control={form.control}
            name="workplace"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ที่ทำงาน</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="work_address_number"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>เลขที่</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="building"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>อาคาร</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="work_alley"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>ซอย</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="work_road"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>ถนน</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex space-x-4">
            <ThailandAddressTypeahead
              value={workAddress}
              onValueChange={(val) => setWorkAddress(val)}
            >
              <FormField
                control={form.control}
                name="work_sub_district"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>ตำบล / แขวง</FormLabel>
                    <FormControl>
                      <ThailandAddressTypeahead.SubdistrictInput
                        className={cn(inputVariants())}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="work_district"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>อำเภอ / เขต</FormLabel>
                    <FormControl>
                      <ThailandAddressTypeahead.DistrictInput
                        className={cn(inputVariants())}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="work_province"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>จังหวัด</FormLabel>
                    <FormControl>
                      <ThailandAddressTypeahead.ProvinceInput
                        className={cn(inputVariants())}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="work_postalcode"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>รหัสไปรษณีย์</FormLabel>
                    <FormControl>
                      <ThailandAddressTypeahead.PostalCodeInput
                        className={cn(inputVariants())}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ThailandAddressTypeahead.Suggestion
                key={address.subdistrict}
                containerProps={{
                  className: cn(
                    "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
                  ),
                }}
                optionItemProps={{
                  className: cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors"
                  ),
                }}
              />
            </ThailandAddressTypeahead>
          </div>
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="work_tel"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>โทร</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="work_fax"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>แฟกซ์</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        {/* TODO - section สมาชิกผู้รับรอง */}

        <div className="flex justify-end">
          <Button type="submit" isLoading={isLoading}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}
