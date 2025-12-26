'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Search, Loader2 } from 'lucide-react'

interface AuditFormProps {
  onSubmit: (query: string) => Promise<void>
  loading?: boolean
}

export function AuditForm({ onSubmit, loading = false }: AuditFormProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      await onSubmit(query.trim())
    }
  }

  const examples = [
    'Restaurantes em São Paulo',
    'Clínicas de estética em Belo Horizonte',
    'Barbearias no Rio de Janeiro',
    'Academias em Curitiba',
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-6 h-6" />
          Nova Auditoria
        </CardTitle>
        <CardDescription>
          Digite o nicho e a cidade para iniciar a análise de oportunidades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: Restaurantes em São Paulo"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Exemplos:</span>
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setQuery(example)}
                className="text-xs px-2 py-1 bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
                disabled={loading}
              >
                {example}
              </button>
            ))}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Iniciar Análise
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
