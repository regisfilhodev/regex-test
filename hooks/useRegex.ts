'use client'

import { useState, useMemo, useCallback } from 'react'
import { runRegex, type RegexResult } from '@/lib/regex-engine'
import { explainPattern, type TokenExplanation } from '@/lib/token-explainer'

export function useRegex() {
  const [pattern, setPattern] = useState('\\d+')
  const [text, setText] = useState('Tenho 25 maçãs e 10 bananas')
  const [flags, setFlags] = useState<string[]>(['g'])

  const flagString = flags.join('')

  const result: RegexResult = useMemo(
    () => runRegex(pattern, text, flagString),
    [pattern, text, flagString]
  )

  const explanations: TokenExplanation[] = useMemo(
    () => explainPattern(pattern),
    [pattern]
  )

  const toggleFlag = useCallback((flag: string) => {
    setFlags((prev) => {
      if (prev.includes(flag)) {
        return prev.filter((f) => f !== flag)
      }
      return [...prev, flag]
    })
  }, [])

  return {
    pattern,
    setPattern,
    text,
    setText,
    flags,
    setFlags,
    toggleFlag,
    result,
    explanations,
  }
}
