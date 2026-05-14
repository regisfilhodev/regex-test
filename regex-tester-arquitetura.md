# Testador de Regex Interativo — Arquitetura completa

Stack: **Next.js + Tailwind CSS + shadcn/ui**  
Nível: Fácil/Médio | Tudo roda no front-end, sem back-end ou API externa.

---

## Estrutura de pastas

```
app/
├── page.tsx                  ← página principal (rota "/")
├── layout.tsx                ← layout global (tema dark/light)
└── globals.css               ← estilos globais do Tailwind

components/
├── regex-tester/
│   ├── index.tsx             ← componente raiz (junta tudo)
│   ├── regex-input.tsx       ← campo da expressão regular + flags
│   ├── text-input.tsx        ← campo do texto de teste
│   ├── match-preview.tsx     ← texto com matches destacados
│   ├── groups-panel.tsx      ← painel de grupos capturados
│   ├── explain-panel.tsx     ← explicação de cada token da regex
│   ├── examples-drawer.tsx   ← gaveta com exemplos prontos
│   └── stats-bar.tsx         ← contagem de matches e grupos
└── ui/                       ← componentes shadcn (já gerados pelo CLI)
    ├── badge.tsx
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    ├── label.tsx
    ├── scroll-area.tsx
    ├── sheet.tsx             ← usado pelo examples-drawer
    ├── switch.tsx
    ├── tabs.tsx
    ├── textarea.tsx
    └── tooltip.tsx

lib/
├── regex-engine.ts           ← lógica de matching e parsing
├── token-explainer.ts        ← mapeia tokens → explicações PT-BR
└── examples.ts               ← lista de exemplos prontos
```

---

## Fluxo de dados

```
[RegexInput] ──┐
               ├──→ [useRegex hook] ──→ regex-engine.ts
[TextInput]  ──┘         │
                          ├──→ matches[]  ──→ [MatchPreview]
                          ├──→ groups[]   ──→ [GroupsPanel]
                          ├──→ error?     ──→ badge de erro
                          └──→ pattern    ──→ token-explainer.ts ──→ [ExplainPanel]
```

---

## Componentes detalhados

### `lib/regex-engine.ts`

Toda a lógica de regex fica aqui — os componentes só chamam essa lib.

```ts
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

export function runRegex(pattern: string, text: string, flags: string): RegexResult {
  if (!pattern) return { matches: [], error: null, flags, groupCount: 0 }

  let rx: RegExp
  try {
    // Garante flag 'd' para indices (suportado em Node 18+/browsers modernos)
    const safeFlags = flags.includes('g') ? flags : flags + 'g'
    rx = new RegExp(pattern, safeFlags)
  } catch (e: any) {
    return { matches: [], error: e.message, flags, groupCount: 0 }
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
    if (!rx.global) break       // evita loop infinito sem flag g
    if (m[0].length === 0) rx.lastIndex++  // evita loop em match vazio
  }

  // Conta grupos: executa regex em string vazia e mede o array
  let groupCount = 0
  try { groupCount = new RegExp(pattern + '|').exec('')!.length - 1 } catch {}

  return { matches, error: null, flags, groupCount }
}
```

---

### `lib/token-explainer.ts`

Mapeia cada símbolo para uma explicação em português.

```ts
export interface TokenExplanation {
  token: string
  description: string
  example: string
}

const TOKEN_MAP: Array<[RegExp, string, string]> = [
  [/\(\?:/g,        '(?:…)',      'grupo não-capturante — agrupa sem guardar'],
  [/\(\?=/g,        '(?=…)',      'lookahead positivo — verifica à frente sem consumir'],
  [/\(\?!/g,        '(?!…)',      'lookahead negativo — garante que NÃO está à frente'],
  [/\(\?<!/g,       '(?<!…)',     'lookbehind negativo'],
  [/\(\?<=/g,       '(?<=…)',     'lookbehind positivo'],
  [/\(\?<\w+>/g,    '(?<nome>…)', 'grupo nomeado — captura com nome'],
  [/\\d/g,          '\\d',        'qualquer dígito (0–9)'],
  [/\\D/g,          '\\D',        'qualquer caractere que NÃO é dígito'],
  [/\\w/g,          '\\w',        'letra, dígito ou underscore'],
  [/\\W/g,          '\\W',        'qualquer coisa que NÃO é \\w'],
  [/\\s/g,          '\\s',        'qualquer espaço em branco'],
  [/\\S/g,          '\\S',        'qualquer coisa que NÃO é espaço'],
  [/\\b/g,          '\\b',        'limite de palavra (entre \\w e \\W)'],
  [/\\B/g,          '\\B',        'NÃO é limite de palavra'],
  [/\\n/g,          '\\n',        'nova linha (line feed)'],
  [/\\t/g,          '\\t',        'tabulação (tab)'],
  [/\[\^[^\]]+\]/g, '[^…]',       'classe negada — qualquer char EXCETO os listados'],
  [/\[[^\]]+\]/g,   '[…]',        'classe de caracteres — qualquer char dentro'],
  [/\{(\d+),(\d+)\}/g, '{n,m}',  'entre n e m repetições'],
  [/\{(\d+),\}/g,   '{n,}',       'n ou mais repetições'],
  [/\{(\d+)\}/g,    '{n}',        'exatamente n repetições'],
  [/\*/g,           '*',          'zero ou mais vezes (guloso)'],
  [/\+/g,           '+',          'uma ou mais vezes (guloso)'],
  [/\?(?![=!<:])/g, '?',          'zero ou uma vez — torna opcional'],
  [/\.\*/g,         '.*',         'qualquer coisa, qualquer quantidade (guloso)'],
  [/(?<!\\)\./g,    '.',          'qualquer caractere exceto quebra de linha'],
  [/\^/g,           '^',          'início da string (ou linha com flag m)'],
  [/\$/g,           '$',          'fim da string (ou linha com flag m)'],
  [/\|/g,           '|',          'alternativa — casa um OU outro'],
  [/\(/g,           '(…)',         'abre grupo de captura'],
]

export function explainPattern(pattern: string): TokenExplanation[] {
  const found = new Map<string, TokenExplanation>()
  for (const [rx, token, description] of TOKEN_MAP) {
    const clone = new RegExp(rx.source, 'g')
    if (clone.test(pattern) && !found.has(token)) {
      found.set(token, { token, description, example: token })
    }
  }
  return [...found.values()]
}
```

---

### `lib/examples.ts`

```ts
export interface RegexExample {
  label: string
  pattern: string
  flags: string
  testText: string
  description: string
}

export const EXAMPLES: RegexExample[] = [
  {
    label: 'Números inteiros',
    pattern: '\\d+',
    flags: 'g',
    testText: 'Tenho 25 maçãs e 10 bananas. Custou R$ 3,50.',
    description: 'Captura qualquer sequência de dígitos',
  },
  {
    label: 'E-mail',
    pattern: '[\\w.+-]+@[\\w-]+\\.[\\w.]+',
    flags: 'gi',
    testText: 'Contato: joao@email.com ou maria.silva@empresa.com.br',
    description: 'Formato básico de endereço de e-mail',
  },
  {
    label: 'CPF',
    pattern: '\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}',
    flags: 'g',
    testText: 'CPFs: 123.456.789-09 e 987.654.321-00',
    description: 'CPF no formato 000.000.000-00',
  },
  {
    label: 'CEP',
    pattern: '\\d{5}-?\\d{3}',
    flags: 'g',
    testText: 'CEPs válidos: 01310-100 e 20040100',
    description: 'CEP com ou sem hífen',
  },
  {
    label: 'Data BR',
    pattern: '(\\d{2})\\/(\\d{2})\\/(\\d{4})',
    flags: 'g',
    testText: 'Reunião: 12/05/2025. Entrega: 30/06/2025.',
    description: 'Data no formato DD/MM/AAAA com grupos de captura',
  },
  {
    label: 'Telefone BR',
    pattern: '\\(?\\d{2}\\)?[\\s-]?\\d{4,5}-?\\d{4}',
    flags: 'g',
    testText: 'Ligue: (11) 99999-0000 ou 21 3333-4444',
    description: 'Celular ou fixo com DDD',
  },
  {
    label: 'URL simples',
    pattern: 'https?:\\/\\/[\\w.-]+(?:\\/[^\\s]*)?',
    flags: 'gi',
    testText: 'Visite https://google.com ou http://meusite.com.br/pagina',
    description: 'URLs com http ou https',
  },
  {
    label: 'Hashtag',
    pattern: '#\\w+',
    flags: 'g',
    testText: 'Post: #javascript #regex #programação é incrível!',
    description: 'Qualquer hashtag',
  },
  {
    label: 'Palavras repetidas',
    pattern: '\\b(\\w+)\\s+\\1\\b',
    flags: 'gi',
    testText: 'Esse texto tem tem palavras palavras repetidas.',
    description: 'Backreference: detecta palavras duplicadas em sequência',
  },
  {
    label: 'Cor hexadecimal',
    pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\\b',
    flags: 'g',
    testText: 'Cores: #FF5733, #fff, #1a2b3c, texto sem cor.',
    description: 'Hex de 3 ou 6 dígitos',
  },
]
```

---

### `hooks/useRegex.ts`

Hook central — conecta o estado de UI à lógica da lib.

```ts
'use client'

import { useState, useMemo } from 'react'
import { runRegex, type RegexResult } from '@/lib/regex-engine'
import { explainPattern, type TokenExplanation } from '@/lib/token-explainer'

export interface RegexState {
  pattern: string
  text: string
  flags: Set<string>
}

export function useRegex() {
  const [pattern, setPattern] = useState('\\d+')
  const [text, setText] = useState('Tenho 25 maçãs e 10 bananas')
  const [flags, setFlags] = useState<Set<string>>(new Set(['g']))

  const flagString = [...flags].join('')

  const result: RegexResult = useMemo(
    () => runRegex(pattern, text, flagString),
    [pattern, text, flagString]
  )

  const explanations: TokenExplanation[] = useMemo(
    () => explainPattern(pattern),
    [pattern]
  )

  const toggleFlag = (flag: string) => {
    setFlags(prev => {
      const next = new Set(prev)
      next.has(flag) ? next.delete(flag) : next.add(flag)
      return next
    })
  }

  return {
    pattern, setPattern,
    text, setText,
    flags, toggleFlag,
    result,
    explanations,
  }
}
```

---

### `components/regex-tester/match-preview.tsx`

Parte mais visual: reconstrói o texto com `<mark>` colorido em cada match.

```tsx
import { type RegexMatch } from '@/lib/regex-engine'

const MATCH_COLORS = [
  'bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100',
  'bg-emerald-200 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100',
  'bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100',
  'bg-pink-200 text-pink-900 dark:bg-pink-800 dark:text-pink-100',
  'bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-100',
]

interface Props {
  text: string
  matches: RegexMatch[]
}

export function MatchPreview({ text, matches }: Props) {
  if (matches.length === 0) {
    return (
      <p className="font-mono text-sm text-muted-foreground whitespace-pre-wrap">
        {text || <span className="italic">Nenhum texto inserido</span>}
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
        className={`rounded px-0.5 ${MATCH_COLORS[i % MATCH_COLORS.length]}`}
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
```

---

### `components/regex-tester/index.tsx`

Monta todos os painéis.

```tsx
'use client'

import { useRegex } from '@/hooks/useRegex'
import { RegexInput }      from './regex-input'
import { TextInput }       from './text-input'
import { MatchPreview }    from './match-preview'
import { GroupsPanel }     from './groups-panel'
import { ExplainPanel }    from './explain-panel'
import { ExamplesDrawer }  from './examples-drawer'
import { StatsBar }        from './stats-bar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { type RegexExample } from '@/lib/examples'

export function RegexTester() {
  const state = useRegex()
  const { result, explanations } = state

  const handleExample = (ex: RegexExample) => {
    state.setPattern(ex.pattern)
    state.setText(ex.testText)
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Testador de Regex
        </h1>
        <ExamplesDrawer onSelect={handleExample} />
      </div>

      {/* Inputs */}
      <Card>
        <CardContent className="pt-4 space-y-4">
          <RegexInput
            pattern={state.pattern}
            flags={state.flags}
            error={result.error}
            onPatternChange={state.setPattern}
            onFlagToggle={state.toggleFlag}
          />
          <TextInput value={state.text} onChange={state.setText} />
        </CardContent>
      </Card>

      {/* Stats */}
      {!result.error && (
        <StatsBar
          matchCount={result.matches.length}
          groupCount={result.groupCount}
        />
      )}

      {/* Resultado */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Resultado
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result.error ? (
            <Badge variant="destructive" className="text-xs">
              Regex inválida: {result.error}
            </Badge>
          ) : (
            <Tabs defaultValue="preview">
              <TabsList className="mb-3">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="groups">
                  Grupos {result.groupCount > 0 && `(${result.groupCount})`}
                </TabsTrigger>
                <TabsTrigger value="explain">Explicação</TabsTrigger>
              </TabsList>

              <TabsContent value="preview">
                <MatchPreview text={state.text} matches={result.matches} />
              </TabsContent>

              <TabsContent value="groups">
                <GroupsPanel matches={result.matches} />
              </TabsContent>

              <TabsContent value="explain">
                <ExplainPanel explanations={explanations} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
```

---

### `components/regex-tester/regex-input.tsx`

```tsx
'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const FLAGS = [
  { flag: 'g', label: 'g', title: 'Global — encontra todos os matches' },
  { flag: 'i', label: 'i', title: 'Case-insensitive — ignora maiúsculas' },
  { flag: 'm', label: 'm', title: 'Multiline — ^ e $ por linha' },
  { flag: 's', label: 's', title: 'Dotall — . inclui quebras de linha' },
]

interface Props {
  pattern: string
  flags: Set<string>
  error: string | null
  onPatternChange: (v: string) => void
  onFlagToggle: (f: string) => void
}

export function RegexInput({ pattern, flags, error, onPatternChange, onFlagToggle }: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor="regex" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Expressão regular
      </Label>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground font-mono text-lg">/</span>
        <Input
          id="regex"
          value={pattern}
          onChange={e => onPatternChange(e.target.value)}
          placeholder="ex: \d+"
          className="font-mono text-sm flex-1"
          spellCheck={false}
          autoComplete="off"
        />
        <span className="text-muted-foreground font-mono text-lg">/</span>
        <div className="flex gap-1">
          {FLAGS.map(({ flag, label, title }) => (
            <Button
              key={flag}
              variant={flags.has(flag) ? 'default' : 'outline'}
              size="sm"
              className="w-8 h-8 p-0 font-mono text-xs"
              title={title}
              onClick={() => onFlagToggle(flag)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}
```

---

### `components/regex-tester/explain-panel.tsx`

```tsx
import { type TokenExplanation } from '@/lib/token-explainer'
import { Badge } from '@/components/ui/badge'

interface Props {
  explanations: TokenExplanation[]
}

export function ExplainPanel({ explanations }: Props) {
  if (explanations.length === 0) {
    return <p className="text-sm text-muted-foreground italic">Nenhum token especial encontrado.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {explanations.map(({ token, description }) => (
        <div key={token} className="flex gap-3 items-start p-3 rounded-lg border bg-muted/40">
          <Badge variant="secondary" className="font-mono text-xs shrink-0 mt-0.5">
            {token}
          </Badge>
          <p className="text-sm text-muted-foreground leading-snug">{description}</p>
        </div>
      ))}
    </div>
  )
}
```

---

### `components/regex-tester/examples-drawer.tsx`

```tsx
'use client'

import { EXAMPLES, type RegexExample } from '@/lib/examples'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

interface Props {
  onSelect: (ex: RegexExample) => void
}

export function ExamplesDrawer({ onSelect }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">Exemplos</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Exemplos prontos</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)] mt-4 pr-2">
          <div className="space-y-2">
            {EXAMPLES.map(ex => (
              <button
                key={ex.label}
                className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors"
                onClick={() => onSelect(ex)}
              >
                <p className="font-medium text-sm">{ex.label}</p>
                <Badge variant="secondary" className="font-mono text-xs mt-1">
                  {ex.pattern}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">{ex.description}</p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
```

---

### `app/page.tsx`

```tsx
import { RegexTester } from '@/components/regex-tester'

export default function Home() {
  return (
    <main className="min-h-screen py-10 bg-background">
      <RegexTester />
    </main>
  )
}
```

---

## Componentes shadcn necessários

Instale com o CLI do shadcn — todos de uma vez:

```bash
npx shadcn@latest add badge button card input label scroll-area sheet switch tabs textarea tooltip
```

---

## Ordem de implementação sugerida

1. `lib/regex-engine.ts` — lógica pura, teste no console antes de qualquer UI
2. `lib/examples.ts` — dados estáticos, sem dependência
3. `lib/token-explainer.ts` — também pura, sem UI
4. `hooks/useRegex.ts` — conecta as libs com estado React
5. `components/regex-tester/match-preview.tsx` — o componente mais visual
6. `components/regex-tester/regex-input.tsx` — campo + botões de flag
7. `components/regex-tester/explain-panel.tsx`
8. `components/regex-tester/examples-drawer.tsx`
9. `components/regex-tester/groups-panel.tsx` e `stats-bar.tsx`
10. `components/regex-tester/index.tsx` — monta tudo
11. `app/page.tsx` — coloca na página

---

## Extras para impressionar (todos opcionais)

| Extra | Como fazer |
|---|---|
| Modo dark | `next-themes` + Toggle no header |
| Animação nos matches | `className="transition-all"` + `animate-pulse` no primeiro render |
| Copiar regex | `navigator.clipboard.writeText(pattern)` num botão |
| Permalink | `useSearchParams` para ler/salvar pattern+text na URL |
| Contador de performance | `Date.now()` antes/depois do `runRegex` |
| Atalho de teclado | `useEffect` + `keydown` para `Ctrl+Enter` rodar o teste |
