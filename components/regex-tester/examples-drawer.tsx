'use client'

import { useState } from 'react'
import { EXAMPLES, type RegexExample } from '@/lib/examples'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { BookOpenIcon } from 'lucide-react'

interface Props {
  onSelect: (ex: RegexExample) => void
}

export function ExamplesDrawer({ onSelect }: Props) {
  const [open, setOpen] = useState(false)

  const handleSelect = (ex: RegexExample) => {
    onSelect(ex)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <BookOpenIcon data-icon="inline-start" />
          Exemplos
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg flex flex-col h-full min-w-lg">
        <SheetHeader>
          <SheetTitle>Exemplos prontos</SheetTitle>
          <SheetDescription>
            Selecione um exemplo para carregar automaticamente o padrão e texto de teste.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="flex flex-col gap-3 p-4">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                className="w-full text-left p-4 rounded-lg border hover:bg-muted transition-colors"
                onClick={() => handleSelect(ex)}
              >
                <p className="font-medium text-sm">{ex.label}</p>
                <Badge
                  variant="secondary"
                  className="font-mono text-xs mt-2"
                >
                  {ex.pattern}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {ex.description}
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
