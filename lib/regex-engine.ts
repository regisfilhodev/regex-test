export interface RegexMatch {
  fullMatch: string
  index: number
  end: number
  groups: (string | undefined)[]
  namedGroups: Record<string, string>
}

export interface RegexResult {
  matches: RegexMatch[]
  error: string | null
  flags: string
  groupCount: number
}

export function runRegex(
  pattern: string,
  text: string,
  flags: string
): RegexResult {
  if (!pattern) return { matches: [], error: null, flags, groupCount: 0 }

  let rx: RegExp
  try {
    // Garante flag 'g' para iterar todos os matches
    const safeFlags = flags.includes('g') ? flags : flags + 'g'
    rx = new RegExp(pattern, safeFlags)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    return { matches: [], error: message, flags, groupCount: 0 }
  }

  const matches: RegexMatch[] = []
  let m: RegExpExecArray | null

  while ((m = rx.exec(text)) !== null) {
    matches.push({
      fullMatch: m[0],
      index: m.index,
      end: m.index + m[0].length,
      groups: m.slice(1),
      namedGroups: (m.groups as Record<string, string>) ?? {},
    })
    if (!rx.global) break // evita loop infinito sem flag g
    if (m[0].length === 0) rx.lastIndex++ // evita loop em match vazio
  }

  // Conta grupos: executa regex em string vazia e mede o array
  let groupCount = 0
  try {
    groupCount = new RegExp(pattern + '|').exec('')!.length - 1
  } catch {
    // ignora erros de regex inválida
  }

  return { matches, error: null, flags, groupCount }
}
