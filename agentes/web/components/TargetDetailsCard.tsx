'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { MapPin, Phone, Globe, Star, MessageCircle } from 'lucide-react'

interface TargetDetailsCardProps {
  selectedScore: {
    score: number
    priority: string
    estimatedMonthlyLoss: number
    place: {
      title: string
      address?: string
      phone?: string
      website?: string
      rating?: number
      reviews?: number
    }
    issues?: Array<{
      type: string
      severity: number
      description: string
      impact: string
      recommendation: string
    }>
  }
}

export function TargetDetailsCard({ selectedScore }: TargetDetailsCardProps) {
  const { place, issues } = selectedScore

  const getIssueTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'NO_WEBSITE': 'Sem Website',
      'NO_PHONE': 'Sem Telefone',
      'LOW_RATING': 'Avaliação Baixa',
      'FEW_REVIEWS': 'Poucos Reviews',
      'INCOMPLETE_INFO': 'Info Incompleta',
      'POOR_REPUTATION': 'Má Reputação'
    }
    return labels[type] || type
  }

  const getIssueColor = (severity: number) => {
    if (severity >= 8) return 'bg-red-500'
    if (severity >= 6) return 'bg-orange-500'
    if (severity >= 4) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alvo Selecionado</CardTitle>
        <CardDescription>Informações detalhadas do estabelecimento</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Nome e Endereço */}
        <div>
          <h3 className="text-xl font-bold">{place.title}</h3>
          {place.address && (
            <div className="flex items-start gap-2 mt-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{place.address}</span>
            </div>
          )}
        </div>

        {/* Informações de Contato */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Telefone */}
          <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <div className="text-sm">
              <div className="font-medium">Telefone</div>
              <div className="text-muted-foreground">
                {place.phone && !place.phone.includes('NÃO POSSUI')
                  ? place.phone
                  : '❌ Não disponível'}
              </div>
            </div>
          </div>

          {/* Website */}
          <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <div className="text-sm">
              <div className="font-medium">Website</div>
              <div className="text-muted-foreground truncate">
                {place.website && !place.website.includes('NÃO POSSUI')
                  ? place.website
                  : '❌ Não disponível'}
              </div>
            </div>
          </div>

          {/* Rating */}
          {place.rating !== undefined && (
            <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded">
              <Star className="w-4 h-4 text-muted-foreground" />
              <div className="text-sm">
                <div className="font-medium">Avaliação</div>
                <div className="flex items-center gap-1">
                  <span className={place.rating < 4.0 ? 'text-red-600 font-semibold' : ''}>
                    {place.rating.toFixed(1)}/5.0
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Reviews */}
          {place.reviews !== undefined && (
            <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded">
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
              <div className="text-sm">
                <div className="font-medium">Reviews</div>
                <div className={place.reviews < 30 ? 'text-red-600 font-semibold' : ''}>
                  {place.reviews} avaliações
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Problemas Identificados */}
        {issues && issues.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 text-sm">Problemas Críticos Identificados</h4>
            <div className="space-y-2">
              {issues.map((issue, idx) => (
                <div key={idx} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      {getIssueTypeLabel(issue.type)}
                    </span>
                    <Badge className={getIssueColor(issue.severity)}>
                      Severidade: {issue.severity}/10
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <strong>Impacto:</strong> {issue.impact}
                  </p>
                  <p className="text-xs bg-blue-50 dark:bg-blue-950 p-2 rounded">
                    <strong>💡 Recomendação:</strong> {issue.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
