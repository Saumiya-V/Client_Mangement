import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { DatePickerProps } from "./types"
import { useEffect } from "react"


export function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | null>(value ?? null)

useEffect(() => {
    setDate(value ?? null)
  }, [value])

  function handleSelect(date: Date | undefined) {
    setDate(date ?? null)
    setOpen(false)
    if (onChange) onChange(date)
  }

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="justify-between font-normal outline-none w-full bg-transparent border-none focus:ring-0  text-sm hover:bg-white text-black"
          >
            {date ? `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth()+1).padStart(2, '0')}/${date.getFullYear()}`: <p className="text-gray-400">dd/mm/yyyy</p>}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date ?? undefined}
            captionLayout="dropdown"
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
