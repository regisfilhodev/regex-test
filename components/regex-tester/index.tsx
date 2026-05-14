'use client'

import { useRegex } from '@/hooks/useRegex'
import { RegexInput } from './regex-input'
import { TextInput } from './text-input'
import { MatchPreview } from './match-preview'
import { GroupsPanel } from './groups-panel'
import { ExplainPanel } from './explain-panel'
import { ExamplesDrawer } from './examples-drawer'
import { StatsBar } from './stats-bar'
import { ThemeToggle } from '@/components/theme-toggle'
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
    // Converte a string de flags do exemplo em array para setar corretamente
    state.setFlags(ex.flags.split(''))
  }

  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col gap-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Testador de Regex
        </h1>
        <div className="flex items-center gap-2">
          <ExamplesDrawer onSelect={handleExample} />
          <ThemeToggle />
        </div>
      </div>

      {/* Inputs */}
      <Card>
        <CardContent className="flex flex-col gap-4">
          <RegexInput
            pattern={state.pattern}
            flags={state.flags}
            error={result.error}
            onPatternChange={state.setPattern}
            onFlagsChange={state.setFlags}
          />
          <TextInput value={state.text} onChange={state.setText} />
        </CardContent>
      </Card>

      {/* Stats */}
      {!result.error ? (
        <StatsBar
          matchCount={result.matches.length}
          groupCount={result.groupCount}
        />
      ) : null}

      {/* Resultado */}
      <Card>
        <CardHeader>
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
                  Grupos{' '}
                  {result.groupCount > 0 ? `(${result.groupCount})` : ''}
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
