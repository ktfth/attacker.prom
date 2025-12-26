'use client'

import { useState } from 'react'
import { AuditForm } from '@/components/AuditForm'
import { ResultCard } from '@/components/ResultCard'
import { TargetDetailsCard } from '@/components/TargetDetailsCard'
import { ActionPanel } from '@/components/ActionPanel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, TrendingUp, Zap, Shield } from 'lucide-react'

interface AnalysisResult {
  success: boolean
  query: string
  realData?: string
  selectedTarget?: string
  finalDossier?: string
  topTargets?: any[]
  selectedScore?: any
  error?: string
}

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (query: string) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      const data: AnalysisResult = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || 'Erro desconhecido na análise')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao conectar com a API')
    } finally {
      setLoading(false)
    }
  }

  // Extrair informações do alvo para o ActionPanel
  const getTargetInfo = () => {
    if (!result?.selectedScore?.place) {
      // Fallback: tentar extrair do selectedTarget (texto)
      if (!result?.selectedTarget) return null

      const lines = result.selectedTarget.split('\n')
      const nome = lines.find(l => l.includes('Nome:') || l.includes('title:'))?.split(/Nome:|title:/)[1]?.trim() || 'Alvo'
      const telefone = lines.find(l => l.includes('Telefone:') || l.includes('phone:'))?.split(/Telefone:|phone:/)[1]?.trim()
      const email = lines.find(l => l.includes('Email:') || l.includes('email:'))?.split(/Email:|email:/)[1]?.trim()

      return { nome, telefone, email }
    }

    // Usar dados estruturados do selectedScore
    return {
      nome: result.selectedScore.place.title || 'Alvo',
      telefone: result.selectedScore.place.phone || undefined,
      email: undefined // Email geralmente não vem do Google Maps
    }
  }

  // Extrair mensagem do dossiê (seção Script WhatsApp)
  const getWhatsAppMessage = () => {
    if (!result?.finalDossier) return ''

    const sections = result.finalDossier.split('##')
    const scriptSection = sections.find(s => s.includes('Script WhatsApp'))

    if (scriptSection) {
      // Extrair apenas o conteúdo após o título
      const content = scriptSection.split('\n').slice(1).join('\n').trim()
      return content
    }

    return result.finalDossier.substring(0, 500) // Fallback
  }

  const targetInfo = getTargetInfo()
  const whatsappMessage = getWhatsAppMessage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Sniper Agent</h1>
                <p className="text-sm text-muted-foreground">
                  Sistema de Auditoria e Intervenção
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Features */}
          {!result && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Análise Rápida</h3>
                      <p className="text-sm text-muted-foreground">
                        Identifica oportunidades em segundos usando dados reais
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Score Inteligente</h3>
                      <p className="text-sm text-muted-foreground">
                        Sistema de pontuação objetiva (0-100 pontos)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Ações Práticas</h3>
                      <p className="text-sm text-muted-foreground">
                        Scripts prontos e cálculo de receita cessante
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Search Form */}
          <AuditForm onSubmit={handleAnalyze} loading={loading} />

          {/* Error */}
          {error && (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Erro na Análise</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {result && result.success && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Results */}
              <div className="lg:col-span-2 space-y-4">
                <ResultCard result={result} />

                {/* Detalhes do Alvo Selecionado */}
                {result.selectedScore && (
                  <TargetDetailsCard selectedScore={result.selectedScore} />
                )}
              </div>

              {/* Actions Sidebar */}
              <div className="space-y-4">
                {targetInfo && whatsappMessage && (
                  <ActionPanel target={targetInfo} message={whatsappMessage} />
                )}

                {/* Stats Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Query</span>
                      <span className="text-sm font-medium">{result.query}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <span className="text-sm font-medium text-green-600">
                        ✓ Concluído
                      </span>
                    </div>
                    {result.topTargets && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Alvos Encontrados
                        </span>
                        <span className="text-sm font-medium">
                          {result.topTargets.length}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-white/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Sniper Agent v2.1.0 - Sistema de Auditoria de Receita Cessante
          </p>
          <p className="mt-1">
            Powered by LangGraph + Google Gemini AI
          </p>
        </div>
      </footer>
    </div>
  )
}
