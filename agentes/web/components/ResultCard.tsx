'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { MarkdownDossier } from './MarkdownDossier'
import { AlertCircle, TrendingDown, FileText, Target } from 'lucide-react'

interface ResultCardProps {
  result: {
    query: string
    selectedTarget?: string
    finalDossier?: string
    selectedScore?: {
      score: number
      priority: string
      estimatedMonthlyLoss: number
      place?: {
        title: string
        phone?: string
        website?: string
      }
    }
    topTargets?: Array<{
      place: {
        title: string
        address?: string
        phone?: string
        website?: string
        rating?: number
        reviews?: number
      }
      score: number
      priority: string
      estimatedMonthlyLoss: number
    }>
  }
}

export function ResultCard({ result }: ResultCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'CRÍTICA':
        return 'bg-red-500'
      case 'ALTA':
        return 'bg-orange-500'
      case 'MÉDIA':
        return 'bg-yellow-500'
      case 'BAIXA':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Target className="w-6 h-6" />
              Resultado da Análise
            </span>
            {result.selectedScore && (
              <Badge className={getPriorityColor(result.selectedScore.priority)}>
                {result.selectedScore.priority}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>{result.query}</CardDescription>
        </CardHeader>
      </Card>

      {/* Score e Perda */}
      {result.selectedScore && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Score de Prioridade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{result.selectedScore.score}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Pontuação de 0-100
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Perda Estimada Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {formatCurrency(result.selectedScore.estimatedMonthlyLoss || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Receita cessante por mês
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Targets */}
      {result.topTargets && result.topTargets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top 5 Alvos Identificados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.topTargets.slice(0, 5).map((target, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{target.place?.title || 'Estabelecimento'}</div>
                    {target.place?.address && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {target.place.address}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-2">
                      <div className="text-xs text-muted-foreground">
                        Perda/mês
                      </div>
                      <div className="text-sm font-semibold text-red-600">
                        {formatCurrency(target.estimatedMonthlyLoss || 0)}
                      </div>
                    </div>
                    <Badge variant="outline">{target.score} pts</Badge>
                    <Badge className={getPriorityColor(target.priority)}>
                      {target.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dossiê */}
      {result.finalDossier && (
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Dossiê de Intervenção
            </CardTitle>
            <CardDescription>
              Relatório completo e acionável para abordagem imediata
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <MarkdownDossier content={result.finalDossier} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
