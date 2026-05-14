import { Badge } from '@/components/ui/badge'

interface Props {
  matchCount: number
  groupCount: number
}

export function StatsBar({ matchCount, groupCount }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="text-xs">
        {matchCount} {matchCount === 1 ? 'match' : 'matches'}
      </Badge>
      {groupCount > 0 ? (
        <Badge variant="outline" className="text-xs">
          {groupCount} {groupCount === 1 ? 'grupo' : 'grupos'}
        </Badge>
      ) : null}
    </div>
  )
}
