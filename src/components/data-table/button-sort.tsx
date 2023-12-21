import React from "react"

import { type Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ButtonSortProps<TData, TValue> {
  column: Column<TData, TValue>
  children: React.ReactNode
}

export function ButtonSort<TData, TValue>({
  column,
  children,
}: ButtonSortProps<TData, TValue>) {
  return (
    <Button variant="ghost" onClick={() => column.toggleSorting()}>
      {children}
      {column.getIsSorted() === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  )
}
