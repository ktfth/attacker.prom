import { TargetScore } from "./scoring";

/**
 * Templates de prompts otimizados para o agente
 */
export class PromptTemplates {
  /**
   * Prompt para análise de alvos (usado no nó de análise)
   */
  static getAnalysisPrompt(
    realData: string,
    topScores: TargetScore[]
  ): string {
    const scoresFormatted = topScores
      .map(
        (ts, idx) => `
ALVO ${idx + 1}: ${ts.place.title}
Score: ${ts.score}/100 (Prioridade ${ts.priority})
Rating: ${ts.place.rating || "N/A"} | Reviews: ${ts.place.reviews || 0}
Website: ${ts.place.website}
Telefone: ${ts.place.phone}
Perda Mensal Estimada: R$ ${ts.estimatedMonthlyLoss.toLocaleString("pt-BR")}

Problemas Críticos:
${ts.issues.map((i) => `- ${i.description} (Severidade: ${i.severity}/10)`).join("\n")}
`
      )
      .join("\n" + "=".repeat(60) + "\n");

    return `Você é um Analista de Oportunidades de Mercado especializado em identificar falhas digitais que geram receita cessante.

CONTEXTO:
Você tem acesso a dados reais do Google Maps de negócios locais. Seu objetivo é selecionar O ALVO PRIORITÁRIO para uma intervenção de consultoria focada em corrigir falhas operacionais visíveis.

DADOS ANALISADOS E PRÉ-PONTUADOS:
${scoresFormatted}

CRITÉRIOS DE DECISÃO:
1. **Impacto Financeiro**: Quanto maior a perda mensal estimada, maior a urgência
2. **Facilidade de Correção**: Problemas simples (ex: adicionar website) têm ROI mais rápido
3. **Probabilidade de Conversão**: Negócios com reviews baixos mas existentes mostram atividade
4. **Urgência**: Falta de website é mais crítica que poucos reviews

SUA MISSÃO:
Selecione UM alvo da lista acima. Retorne APENAS no seguinte formato (sem markdown, sem formatação extra):

ALVO SELECIONADO: [Nome do Negócio]

ERRO TÉCNICO PRINCIPAL: [Descreva o problema mais crítico em 1 frase]

IMPACTO FINANCEIRO: R$ [valor]/mês em receita cessante

JUSTIFICATIVA: [2-3 frases explicando por que este é o melhor alvo para abordagem comercial. Foque em: (1) urgência do problema, (2) facilidade de demonstrar valor, (3) probabilidade de fechar venda]

GATILHO EMOCIONAL: [1 frase que será usada na abordagem - deve conectar o erro técnico à dor do dono]`;
  }

  /**
   * Prompt para geração de dossiê (usado no nó de dossiê)
   */
  static getDossierPrompt(selectedTarget: string, targetScore?: TargetScore): string {
    const additionalContext = targetScore
      ? `
DADOS ADICIONAIS DO ALVO:
- Score de Oportunidade: ${targetScore.score}/100
- Prioridade: ${targetScore.priority}
- Perda Mensal: R$ ${targetScore.estimatedMonthlyLoss.toLocaleString("pt-BR")}
- Problemas Identificados: ${targetScore.issues.length}

DETALHAMENTO DOS PROBLEMAS:
${targetScore.issues
  .map(
    (issue) => `
• ${issue.description}
  Impacto: ${issue.impact}
  Solução: ${issue.recommendation}
`
  )
  .join("\n")}
`
      : "";

    return `Você é um Auditor de Eficiência Digital seguindo o **Protocolo Sniper**.

Sua comunicação deve ser:
- ANALÍTICA (baseada em dados reais, não hipóteses)
- DIRETA (sem rodeios ou cortesia excessiva)
- FOCADA EM CUSTO DE OPORTUNIDADE (cada dia de inércia = dinheiro perdido)

ALVO REAL SELECIONADO:
${selectedTarget}
${additionalContext}

Gere um **DOSSIÊ DE INTERVENÇÃO** pronto para envio ao proprietário.

Use EXATAMENTE esta estrutura em Markdown:

---

## 🔍 Diagnóstico Técnico

[Cite o erro REAL encontrado no Google Maps/presença digital deles. Use dados concretos: "Vi no Google Maps que vocês têm X reviews mas não possuem site linkado" ou "Avaliei o perfil digital da [Nome] e identifiquei que..."]

**O que identifiquei:**
- [Erro 1 - específico e verificável]
- [Erro 2 - se aplicável]
- [Erro 3 - se aplicável]

**Classificação Técnica:** [Use termos como "Filtro de Expulsão", "Atrito Digital de Alto Impacto", "Vazamento de Conversão"]

---

## 💰 Impacto na Receita

**Matemática da Perda (Conservadora):**

- **Ticket Médio do Nicho:** R$ [valor estimado baseado na categoria]
- **Clientes Perdidos por Dia:** [número] pessoas que desistem ao encontrar o erro
- **Período de Análise:** 30 dias

**💸 Receita Cessante Mensal: R$ [valor formatado]**

**Anualizada:** R$ [valor mensal × 12]

*Nota: Esta é uma estimativa CONSERVADORA. O impacto real pode ser 2-3x maior considerando sazonalidade e boca-a-boca negativo.*

---

## 📱 Script de Abordagem (WhatsApp)

\`\`\`
[Nome do Dono/Empresa],

[Seu nome], especialista em auditoria digital.

Analisei o perfil do Google da [Nome do Negócio].

Identifiquei [ERRO ESPECÍFICO] que está custando aproximadamente R$ [valor]/mês em clientes que chegam até vocês mas desistem.

Tenho um protocolo de correção de 48h.

Posso te mostrar o diagnóstico completo agora?
\`\`\`

**Instruções de Uso:**
- Enviar entre 9h-11h ou 14h-16h (horários comerciais)
- Não enviar "bom dia" ou saudações genéricas
- Ir direto ao ponto
- Aguardar máximo 2 minutos por resposta

---

## ⚡ Proposta de Intervenção Sniper

**Escopo:** Micro-consultoria focada APENAS no erro crítico identificado

**Prazo:** 48-72 horas

**Entregas:**
1. [Entrega específica baseada no problema - ex: "Landing page responsiva com informações essenciais"]
2. [Segunda entrega se aplicável]
3. Tutorial de manutenção (15 min de vídeo)

**Investimento:** [Deixar em aberto para negociação baseada no valor demonstrado]

**ROI Esperado:** Estancamento imediato do vazamento + [X]% de aumento em conversões digitais em 30 dias

---

## 📊 Comparação com Concorrência

[Se possível, mencionar brevemente como concorrentes diretos estão performando melhor em aspectos digitais]

**O Gap Atual:**
- Concorrente médio no nicho: [X] reviews, site completo, rating [Y]
- [Nome do Negócio]: [Status atual]

**Janela de Oportunidade:** [Insight sobre como fechar esse gap rapidamente]

---

## 🎯 Próximos Passos

1. **Responder confirmando interesse** em ver o diagnóstico detalhado
2. **Agendar call de 15 min** para apresentação do plano de correção
3. **Execução em 48h** (se aprovado)
4. **Acompanhamento de 30 dias** para medir resultados

---

*Dossiê gerado com dados reais extraídos do Google Maps.*
*Validade da análise: 7 dias (dados podem se atualizar).*
`;
  }

  /**
   * Prompt para análise quando não há dados suficientes
   */
  static getNoDataPrompt(): string {
    return `Nenhum dado útil foi encontrado para análise.

Possíveis causas:
1. Query de busca muito específica ou sem resultados
2. Região sem negócios cadastrados no Google Maps
3. Erro na API de busca

Recomendações:
- Tente uma busca mais ampla (ex: "Restaurantes em São Paulo" ao invés de "Restaurante Vegano Orgânico em Bairro Específico")
- Verifique se o nicho existe na região especificada
- Teste com cidades maiores para validar a conexão`;
  }

  /**
   * Prompt para formatação de dados de negócio
   */
  static getBusinessContextPrompt(category?: string): string {
    const categoryHints = category
      ? `
CONTEXTO DO NICHO: ${category}

Ao analisar, considere:
- Ticket médio típico deste nicho
- Comportamento de compra do consumidor (impulsivo vs planejado)
- Importância da presença digital neste setor
- Sazonalidade (se aplicável)
`
      : "";

    return categoryHints;
  }

  /**
   * Gera prompt personalizado baseado no tipo de problema dominante
   */
  static getPersonalizedDossierPrompt(
    dominantIssue: string,
    targetScore: TargetScore
  ): string {
    const basePrompt = this.getDossierPrompt("", targetScore);

    const customizations: Record<string, string> = {
      NO_WEBSITE: `
FOCO ESPECIAL: Este negócio NÃO TEM WEBSITE.

Enfatize:
- Invisibilidade digital = inexistência para 70%+ dos consumidores modernos
- Perda de clientes que pesquisam "perto de mim" e filtram por "tem site"
- Oportunidade de captura de dados (WhatsApp, email) perdida
- Solução: Landing page simples (1 página) pode resolver 80% do problema em 24h
`,
      LOW_RATING: `
FOCO ESPECIAL: Rating baixo (${targetScore.place.rating}/5.0).

Enfatize:
- Cada review negativa sem resposta = prova de descaso
- Algoritmo do Google penaliza listings com rating <4.0
- Recuperação de reputação tem ROI de 300%+ (cliente reconquistado vale 3x)
- Solução: Protocolo de gestão de reviews + resposta profissional
`,
      FEW_REVIEWS: `
FOCO ESPECIAL: Poucos reviews (${targetScore.place.reviews || 0}).

Enfatize:
- Negócio "fantasma" para algoritmos de busca e descoberta
- Concorrentes com 50+ reviews aparecem 5x mais
- Prova social é decisor #1 para 89% dos consumidores locais
- Solução: Sistema de coleta de reviews pós-atendimento (QR code + automação)
`,
    };

    const dominantCustomization = customizations[dominantIssue] || "";

    return basePrompt.replace(
      "Gere um **DOSSIÊ DE INTERVENÇÃO**",
      `${dominantCustomization}\n\nGere um **DOSSIÊ DE INTERVENÇÃO**`
    );
  }
}
