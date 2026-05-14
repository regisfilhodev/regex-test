import { type RegexMatch } from '@/lib/regex-engine'
import { cn } from '@/lib/utils'

const MATCH_COLORS = [
  'match-color-1',
  'match-color-2',
  'match-color-3',
  'match-color-4',
  'match-color-5',
]

interface Props {
  text: string
  matches: RegexMatch[]
}

export function MatchPreview({ text, matches }: Props) {
  if (matches.length === 0) {
    return (
      <p className="font-mono text-sm text-muted-foreground whitespace-pre-wrap">
        {text ? text : <span className="italic">Nenhum texto inserido</span>}
      </p>
    )
  }

  const parts: React.ReactNode[] = []
  let cursor = 0

  matches.forEach((m, i) => {
    // Texto antes do match
    if (m.index > cursor) {
      parts.push(
        <span key={`pre-${i}`}>{text.slice(cursor, m.index)}</span>
      )
    }
    // O match destacado
    parts.push(
      <mark
        key={`match-${i}`}
        className={cn(
          'rounded px-0.5 font-semibold',
          MATCH_COLORS[i % MATCH_COLORS.length]
        )}
        title={`Match ${i + 1}: "${m.fullMatch}"`}
      >
        {m.fullMatch}
      </mark>
    )
    cursor = m.end
  })

  // Texto restante
  if (cursor < text.length) {
    parts.push(<span key="tail">{text.slice(cursor)}</span>)
  }

  return (
    <p className="font-mono text-sm whitespace-pre-wrap leading-relaxed">
      {parts}
    </p>
  )
}
