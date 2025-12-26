'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { MessageCircle, Mail, Copy, Check, ExternalLink } from 'lucide-react'

interface ActionPanelProps {
  target: {
    nome: string
    telefone?: string
    email?: string
  }
  message: string
}

export function ActionPanel({ target, message }: ActionPanelProps) {
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Erro ao copiar:', error)
    }
  }

  const handleWhatsApp = async () => {
    setLoading('whatsapp')
    try {
      const response = await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'whatsapp',
          target,
          message,
        }),
      })

      const data = await response.json()

      if (data.success && data.url) {
        window.open(data.url, '_blank')
      } else {
        alert(data.error || 'Erro ao gerar link do WhatsApp')
      }
    } catch (error) {
      console.error('Erro ao processar WhatsApp:', error)
      alert('Erro ao processar ação')
    } finally {
      setLoading(null)
    }
  }

  const handleEmail = async () => {
    setLoading('email')
    try {
      const response = await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'email',
          target,
          message,
        }),
      })

      const data = await response.json()

      if (data.success && data.data) {
        const { to, subject, body } = data.data
        const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        window.location.href = mailtoLink
      } else {
        alert(data.error || 'Erro ao preparar email')
      }
    } catch (error) {
      console.error('Erro ao processar email:', error)
      alert('Erro ao processar ação')
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações de Resolução</CardTitle>
        <CardDescription>
          Escolha como entrar em contato com {target.nome}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* WhatsApp */}
          {target.telefone && (
            <Button
              variant="default"
              className="w-full justify-start"
              onClick={handleWhatsApp}
              disabled={loading !== null}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Enviar via WhatsApp
              <ExternalLink className="w-3 h-3 ml-auto" />
            </Button>
          )}

          {/* Email */}
          {target.email && (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleEmail}
              disabled={loading !== null}
            >
              <Mail className="w-4 h-4 mr-2" />
              Enviar via Email
              <ExternalLink className="w-3 h-3 ml-auto" />
            </Button>
          )}

          {/* Copiar */}
          <Button
            variant="secondary"
            className="w-full justify-start"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copiar Mensagem
              </>
            )}
          </Button>
        </div>

        {/* Preview da mensagem */}
        <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Preview da Mensagem:
          </div>
          <div className="text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
            {message}
          </div>
        </div>

        {/* Informações do alvo */}
        <div className="mt-4 p-3 border rounded-lg space-y-1">
          <div className="text-xs font-medium text-muted-foreground">
            Informações do Alvo:
          </div>
          <div className="text-sm">
            <strong>Nome:</strong> {target.nome}
          </div>
          {target.telefone && (
            <div className="text-sm">
              <strong>Telefone:</strong> {target.telefone}
            </div>
          )}
          {target.email && (
            <div className="text-sm">
              <strong>Email:</strong> {target.email}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
