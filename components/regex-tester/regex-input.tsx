'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const FLAGS = [
  { flag: 'g', title: 'Global — encontra todos os matches' },
  { flag: 'i', title: 'Case-insensitive — ignora maiúsculas' },
  { flag: 'm', title: 'Multiline — ^ e $ por linha' },
  { flag: 's', title: 'Dotall — . inclui quebras de linha' },
]

interface Props {
  pattern: string
  flags: string[]
  error: string | null
  onPatternChange: (v: string) => void
  onFlagsChange: (flags: string[]) => void
}

export function RegexInput({
  pattern,
  flags,
  error,
  onPatternChange,
  onFlagsChange,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor="regex"
        className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
      >
        Expressão regular
      </Label>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground font-mono text-lg select-none">
          /
        </span>
        <Input
          id="regex"
          value={pattern}
          onChange={(e) => onPatternChange(e.target.value)}
          placeholder="ex: \d+"
          className="font-mono text-sm flex-1"
          spellCheck={false}
          autoComplete="off"
        />
        <span className="text-muted-foreground font-mono text-lg select-none">
          /
        </span>
        <TooltipProvider delayDuration={300}>
          <ToggleGroup
            type="multiple"
            value={flags}
            onValueChange={onFlagsChange}
            spacing={1}
          >
            {FLAGS.map(({ flag, title }) => (
              <Tooltip key={flag}>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value={flag}
                    className="size-8 font-mono text-xs"
                    aria-label={title}
                  >
                    {flag}
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{title}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </ToggleGroup>
        </TooltipProvider>
      </div>
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : null}
    </div>
  )
}
