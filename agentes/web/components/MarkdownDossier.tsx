'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AlertCircle, DollarSign, MessageCircle, Zap, TrendingUp, Target } from 'lucide-react'

interface MarkdownDossierProps {
  content: string
}

export function MarkdownDossier({ content }: MarkdownDossierProps) {
  // Detectar seções para adicionar ícones
  const getSectionIcon = (heading: string) => {
    if (heading.includes('Diagnóstico')) return <AlertCircle className="w-5 h-5" />
    if (heading.includes('Receita') || heading.includes('Impacto')) return <DollarSign className="w-5 h-5" />
    if (heading.includes('Script') || heading.includes('WhatsApp')) return <MessageCircle className="w-5 h-5" />
    if (heading.includes('Intervenção') || heading.includes('Proposta')) return <Zap className="w-5 h-5" />
    if (heading.includes('Comparação') || heading.includes('Concorrência')) return <TrendingUp className="w-5 h-5" />
    if (heading.includes('Próximos')) return <Target className="w-5 h-5" />
    return null
  }

  return (
    <div className="markdown-dossier">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings com ícones e estilo
          h2: ({ node, children, ...props }) => {
            const text = String(children)
            const icon = getSectionIcon(text)

            return (
              <h2
                className="flex items-center gap-3 text-2xl font-bold mt-8 mb-4 pb-3 border-b-2 border-primary/20 text-primary"
                {...props}
              >
                {icon}
                <span>{children}</span>
              </h2>
            )
          },
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-lg font-semibold mt-4 mb-2 text-foreground" {...props} />
          ),

          // Parágrafos
          p: ({ node, ...props }) => (
            <p className="mb-4 leading-relaxed text-foreground/90" {...props} />
          ),

          // Listas
          ul: ({ node, ...props }) => (
            <ul className="mb-4 ml-6 space-y-2 list-disc marker:text-primary" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="mb-4 ml-6 space-y-2 list-decimal marker:text-primary marker:font-semibold" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed text-foreground/90" {...props} />
          ),

          // Strong (negrito)
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-foreground" {...props} />
          ),

          // Em (itálico)
          em: ({ node, ...props }) => (
            <em className="italic text-muted-foreground" {...props} />
          ),

          // Code blocks
          code: ({ node, inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded font-mono text-sm"
                  {...props}
                >
                  {children}
                </code>
              )
            }

            return (
              <div className="my-4">
                <pre className="bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 p-6 rounded-lg overflow-x-auto border border-slate-700 shadow-lg">
                  <code className="font-mono text-sm leading-relaxed" {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            )
          },

          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-primary pl-4 py-2 my-4 bg-primary/5 italic text-foreground/80"
              {...props}
            />
          ),

          // Horizontal rules
          hr: ({ node, ...props }) => (
            <hr className="my-8 border-t-2 border-dashed border-border" {...props} />
          ),

          // Links
          a: ({ node, ...props }) => (
            <a
              className="text-primary hover:text-primary/80 underline underline-offset-2 font-medium transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),

          // Tabelas (se houver)
          table: ({ node, ...props }) => (
            <div className="my-4 overflow-x-auto">
              <table className="min-w-full border-collapse border border-border" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="border border-border bg-muted px-4 py-2 text-left font-semibold" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-border px-4 py-2" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>

      <style jsx global>{`
        .markdown-dossier {
          /* Animações suaves */
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Destaque para valores monetários */
        .markdown-dossier strong:has(+ *:contains("R$")),
        .markdown-dossier *:contains("R$") {
          color: hsl(var(--destructive));
        }

        /* Estilo especial para emojis de status */
        .markdown-dossier li:has(✅) {
          color: hsl(142, 76%, 36%);
        }

        .markdown-dossier li:has(❌) {
          color: hsl(0, 84%, 60%);
        }

        /* Scroll suave em blocos de código */
        .markdown-dossier pre {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        }

        .markdown-dossier pre::-webkit-scrollbar {
          height: 8px;
        }

        .markdown-dossier pre::-webkit-scrollbar-track {
          background: transparent;
        }

        .markdown-dossier pre::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }
      `}</style>
    </div>
  )
}
