export interface TokenExplanation {
  token: string
  description: string
  example: string
}

// Hoisted RegExp instances (js-hoist-regexp) — criados uma única vez no módulo
const TOKEN_MAP: Array<[RegExp, string, string]> = [
  [/\(\?:/g, '(?:…)', 'grupo não-capturante — agrupa sem guardar'],
  [/\(\?=/g, '(?=…)', 'lookahead positivo — verifica à frente sem consumir'],
  [/\(\?!/g, '(?!…)', 'lookahead negativo — garante que NÃO está à frente'],
  [/\(\?<!/g, '(?<!…)', 'lookbehind negativo'],
  [/\(\?<=/g, '(?<=…)', 'lookbehind positivo'],
  [/\(\?<\w+>/g, '(?<nome>…)', 'grupo nomeado — captura com nome'],
  [/\\d/g, '\\d', 'qualquer dígito (0–9)'],
  [/\\D/g, '\\D', 'qualquer caractere que NÃO é dígito'],
  [/\\w/g, '\\w', 'letra, dígito ou underscore'],
  [/\\W/g, '\\W', 'qualquer coisa que NÃO é \\w'],
  [/\\s/g, '\\s', 'qualquer espaço em branco'],
  [/\\S/g, '\\S', 'qualquer coisa que NÃO é espaço'],
  [/\\b/g, '\\b', 'limite de palavra (entre \\w e \\W)'],
  [/\\B/g, '\\B', 'NÃO é limite de palavra'],
  [/\\n/g, '\\n', 'nova linha (line feed)'],
  [/\\t/g, '\\t', 'tabulação (tab)'],
  [/\[\^[^\]]+\]/g, '[^…]', 'classe negada — qualquer char EXCETO os listados'],
  [/\[[^\]]+\]/g, '[…]', 'classe de caracteres — qualquer char dentro'],
  [/\{(\d+),(\d+)\}/g, '{n,m}', 'entre n e m repetições'],
  [/\{(\d+),\}/g, '{n,}', 'n ou mais repetições'],
  [/\{(\d+)\}/g, '{n}', 'exatamente n repetições'],
  [/\*/g, '*', 'zero ou mais vezes (guloso)'],
  [/\+/g, '+', 'uma ou mais vezes (guloso)'],
  [/\?(?![=!<:])/g, '?', 'zero ou uma vez — torna opcional'],
  [/\.\*/g, '.*', 'qualquer coisa, qualquer quantidade (guloso)'],
  [/(?<!\\)\./g, '.', 'qualquer caractere exceto quebra de linha'],
  [/\^/g, '^', 'início da string (ou linha com flag m)'],
  [/\$/g, '$', 'fim da string (ou linha com flag m)'],
  [/\|/g, '|', 'alternativa — casa um OU outro'],
  [/\(/g, '(…)', 'abre grupo de captura'],
]

export function explainPattern(pattern: string): TokenExplanation[] {
  const found = new Map<string, TokenExplanation>()

  for (const [rx, token, description] of TOKEN_MAP) {
    // Cria clone para não compartilhar lastIndex entre chamadas
    const clone = new RegExp(rx.source, 'g')
    if (clone.test(pattern) && !found.has(token)) {
      found.set(token, { token, description, example: token })
    }
  }

  return [...found.values()]
}
