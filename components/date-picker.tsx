"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
  /** If provided, dates before this will be disabled */
  minDate?: Date
  /** If provided, dates after this will be disabled */
  maxDate?: Date
  className?: string
}

export function DatePicker({ 
  date, 
  onDateChange, 
  disabled, 
  placeholder = "Pick a date",
  minDate,
  maxDate,
  className
}: DatePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Construct the disabled matcher for react-day-picker
  const disabledDays = []
  if (minDate) disabledDays.push({ before: minDate })
  if (maxDate) disabledDays.push({ after: maxDate })

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDate(date) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            onDateChange(selectedDate)
            setIsCalendarOpen(false)
          }}
          disabled={disabledDays}
          initialFocus
          defaultMonth={date || minDate} 
        />
      </PopoverContent>
    </Popover>
  )
}