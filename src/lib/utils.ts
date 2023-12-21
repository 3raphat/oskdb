import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validThaiNationalID(id: string) {
  let i, sum
  if (id.length != 13) return false
  for (i = 0, sum = 0; i < 12; i++) {
    sum += parseInt(id.charAt(i)) * (13 - i)
  }
  const mod = sum % 11
  const check = (11 - mod) % 10
  if (check == parseInt(id.charAt(12))) {
    return true
  }
  return false
}
