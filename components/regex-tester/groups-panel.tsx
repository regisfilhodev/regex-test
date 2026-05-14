import { type RegexMatch } from '@/lib/regex-engine'
import { Badge } from '@/components/ui/badge'

interface Props {
  matches: RegexMatch[]
}

export function GroupsPanel({ matches }: Props) {
  // Filtra matches que possuem grupos
  const matchesWithGroups = matches.filter(
    (m) => m.groups.length > 0 || Object.keys(m.namedGroups).length > 0
  )

  if (matchesWithGroups.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        Nenhum grupo de captura encontrado.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {matchesWithGroups.map((m, i) => (
        <div key={i} className="rounded-lg border p-3">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="font-mono text-xs">
              Match {i + 1}
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              &quot;{m.fullMatch}&quot;
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            {/* Grupos posicionais */}
            {m.groups.map((group, gi) => (
              <div
                key={gi}
                className="flex items-center gap-2 text-sm font-mono"
              >
                <Badge variant="secondary" className="text-xs shrink-0">
                  ${gi + 1}
                </Badge>
                <span className="text-muted-foreground">
                  {group !== undefined ? (
                    `"${group}"`
                  ) : (
                    <span className="italic">undefined</span>
                  )}
                </span>
              </div>
            ))}

            {/* Grupos nomeados */}
            {Object.entries(m.namedGroups).map(([name, value]) => (
              <div
                key={name}
                className="flex items-center gap-2 text-sm font-mono"
              >
                <Badge className="text-xs shrink-0">{name}</Badge>
                <span className="text-muted-foreground">&quot;{value}&quot;</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
