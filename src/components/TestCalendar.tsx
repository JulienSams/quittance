import { useState } from 'react'
import { fr } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

/**
 * Test component to verify Calendar works with French locale
 * This can be deleted after verification
 */
export function TestCalendar() {
  const [date, setDate] = useState<Date>()

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">Test: Calendrier Français</h2>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            {date ? format(date, 'PPP', { locale: fr }) : 'Sélectionner une date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={fr}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {date && (
        <p className="mt-4 text-sm text-muted-foreground">
          Date sélectionnée: {format(date, 'PPPP', { locale: fr })}
        </p>
      )}
    </div>
  )
}
