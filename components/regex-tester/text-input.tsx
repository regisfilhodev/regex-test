import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  value: string
  onChange: (v: string) => void
}

export function TextInput({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor="test-text"
        className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
      >
        Texto de teste
      </Label>
      <Textarea
        id="test-text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cole ou digite o texto para testar a regex..."
        className="font-mono text-sm min-h-[100px] resize-y"
        spellCheck={false}
      />
    </div>
  )
}
