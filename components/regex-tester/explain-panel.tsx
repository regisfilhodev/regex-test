import { type TokenExplanation } from '@/lib/token-explainer'
import { Badge } from '@/components/ui/badge'

interface Props {
  explanations: TokenExplanation[]
}

export function ExplainPanel({ explanations }: Props) {
  if (explanations.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        Nenhum token especial encontrado.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {explanations.map(({ token, description }) => (
        <div
          key={token}
          className="flex gap-3 items-start p-3 rounded-lg border bg-muted/40"
        >
          <Badge variant="secondary" className="font-mono text-xs shrink-0 mt-0.5">
            {token}
          </Badge>
          <p className="text-sm text-muted-foreground leading-snug">
            {description}
          </p>
        </div>
      ))}
    </div>
  )
}
