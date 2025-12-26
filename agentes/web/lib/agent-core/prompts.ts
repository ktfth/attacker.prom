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
    if (!targetScore) {
      return `Erro: Não foi possível gerar dossiê sem dados do alvo.`;
    }

    // Extrair dados reais do alvo
    const nomeNegocio = targetScore.place.title;
    const endereco = targetScore.place.address || "Endereço não disponível";
    const telefone = targetScore.place.phone || "NÃO POSSUI";
    const website = targetScore.place.website || "NÃO POSSUI";
    const rating = targetScore.place.rating || 0;
    const reviews = targetScore.place.reviews || 0;
    const perdaMensal = targetScore.estimatedMonthlyLoss;
    const perdaAnual = perdaMensal * 12;

    // Identificar problemas principais
    const problemasTexto = targetScore.issues
      .map(issue => `- ${issue.description}`)
      .join('\n');

    const problemaPrincipal = targetScore.issues.length > 0
      ? targetScore.issues[0].description
      : "Presença digital deficiente";

    // Calcular ticket médio baseado na categoria
    const categoria = targetScore.place.category?.toLowerCase() || '';
    let ticketMedio = 100; // default

    if (categoria.includes('restaurante') || categoria.includes('food')) ticketMedio = 80;
    else if (categoria.includes('barbearia') || categoria.includes('barber')) ticketMedio = 50;
    else if (categoria.includes('clínica') || categoria.includes('clinic')) ticketMedio = 250;
    else if (categoria.includes('academia') || categoria.includes('gym')) ticketMedio = 150;

    const clientesPerdidosDia = Math.ceil(perdaMensal / (ticketMedio * 30));

    const additionalContext = `
DADOS REAIS DO ALVO (Google Maps):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Nome: ${nomeNegocio}
📮 Endereço: ${endereco}
📞 Telefone: ${telefone}
🌐 Website: ${website}
⭐ Rating: ${rating}/5.0 (${reviews} avaliações)

💰 IMPACTO FINANCEIRO:
- Score de Oportunidade: ${targetScore.score}/100
- Prioridade: ${targetScore.priority}
- Perda Mensal Estimada: R$ ${perdaMensal.toLocaleString("pt-BR")}
- Perda Anual: R$ ${perdaAnual.toLocaleString("pt-BR")}

🚨 PROBLEMAS IDENTIFICADOS (${targetScore.issues.length}):
${targetScore.issues
  .map(
    (issue, idx) => `
${idx + 1}. ${issue.description}
   • Severidade: ${issue.severity}/10
   • Impacto: ${issue.impact}
   • Solução: ${issue.recommendation}
`
  )
  .join("\n")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    return `Você é um Auditor de Eficiência Digital seguindo o **Protocolo Sniper**.

Sua comunicação deve ser:
- ANALÍTICA (baseada em dados reais, não hipóteses)
- DIRETA (sem rodeios ou cortesia excessiva)
- FOCADA EM CUSTO DE OPORTUNIDADE (cada dia de inércia = dinheiro perdido)
${additionalContext}

Gere um **DOSSIÊ DE INTERVENÇÃO** pronto para uso IMEDIATO.

IMPORTANTE: Use OS DADOS REAIS fornecidos acima. Não peça informações adicionais.
Você tem TUDO que precisa: nome, endereço, telefone, website, rating, problemas identificados.

Use EXATAMENTE esta estrutura em Markdown:

---

## 🔍 Diagnóstico Técnico

Analisei o perfil digital da **${nomeNegocio}** (${endereco}) no Google Maps.

**O que identifiquei:**
${problemasTexto}

**Classificação Técnica:** ${targetScore.priority === 'CRÍTICA' ? 'Filtro de Expulsão de Alto Impacto' : targetScore.priority === 'ALTA' ? 'Atrito Digital Significativo' : 'Vazamento de Conversão Moderado'}

**Status Atual:**
- Rating: ${rating}/5.0 com ${reviews} avaliações
- Website: ${website === 'NÃO POSSUI' ? '❌ Ausente (problema crítico)' : '✅ ' + website}
- Telefone: ${telefone === 'NÃO POSSUI' ? '❌ Não listado' : '✅ ' + telefone}

---

## 💰 Impacto na Receita

**Matemática da Perda (Conservadora):**

- **Ticket Médio do Nicho:** R$ ${ticketMedio.toLocaleString("pt-BR")}
- **Clientes Perdidos por Dia:** ~${clientesPerdidosDia} pessoas que desistem ao encontrar os problemas
- **Período de Análise:** 30 dias

**💸 Receita Cessante Mensal: R$ ${perdaMensal.toLocaleString("pt-BR")}**

**Anualizada: R$ ${perdaAnual.toLocaleString("pt-BR")}**

*Nota: Esta é uma estimativa CONSERVADORA. O impacto real pode ser 2-3x maior considerando sazonalidade e boca-a-boca negativo.*

---

## 📱 Script de Abordagem (WhatsApp/Presencial)

**OPÇÃO 1 - WhatsApp:**
\`\`\`
Olá, ${nomeNegocio}!

Sou especialista em auditoria digital e identifiquei uma oportunidade no perfil de vocês.

Analisei o Google Maps e vi que ${problemaPrincipal.toLowerCase()}.

Isso está custando aproximadamente R$ ${Math.floor(perdaMensal / 1000)}mil/mês em clientes que chegam até vocês mas desistem.

Tenho um protocolo de correção de 48h. Posso te mostrar o diagnóstico completo agora?
\`\`\`

**OPÇÃO 2 - Abordagem Presencial:**
"Olá! Acabei de passar aqui na ${endereco} e fiz uma análise rápida do perfil digital de vocês.

Identifiquei ${targetScore.issues.length} problema(s) que provavelmente estão fazendo vocês perderem clientes que pesquisam online.

Tenho 5 minutos para mostrar? É só uma análise rápida, sem compromisso."

**Instruções de Uso:**
- WhatsApp: Enviar entre 9h-11h ou 14h-16h
- Presencial: Ir no estabelecimento (${endereco})
- Ser direto e factual, sem pressão de venda
- Mostrar o diagnóstico no celular se perguntarem

---

## ⚡ Proposta de Intervenção Sniper

**Escopo:** Micro-consultoria focada APENAS nos erros críticos identificados

**Prazo:** 48-72 horas

**Entregas:**
${targetScore.issues.map((issue, idx) => `${idx + 1}. ${issue.recommendation}`).join('\n')}

**Investimento:** R$ 400 - R$ 1.200 (baseado na complexidade da correção)

**ROI Esperado:** Estancamento imediato do vazamento + recuperação de 30-50% da receita cessante em 30 dias

---

## 📊 Comparação com Concorrência

**O Gap Atual:**
- Concorrente médio no nicho: 4.5+ rating, 50+ reviews, site completo
- **${nomeNegocio}**: ${rating}/5.0, ${reviews} reviews, ${website === 'NÃO POSSUI' ? 'sem site' : 'site presente'}

**Janela de Oportunidade:** Corrigir esses gaps em 48h coloca ${nomeNegocio} acima de 70% dos concorrentes diretos que têm os mesmos problemas.

---

## 🎯 Próximos Passos

1. **Se WhatsApp:** Aguardar resposta e agendar call de 15min
2. **Se Presencial:** Deixar cartão e follow-up em 24h
3. **Execução em 48h** (após aprovação)
4. **Acompanhamento de 30 dias** para medir resultados

**DICA PRO:** Mencione que você pode ir até o endereço (${endereco}) para resolver presencialmente se preferirem.

---

*Dossiê gerado com dados reais do Google Maps.*
*Data da análise: ${new Date().toLocaleDateString("pt-BR")}*
*Validade: 7 dias (dados podem se atualizar)*
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
    // Usar o prompt base que já está completo com dados reais
    return this.getDossierPrompt("", targetScore);
  }
}
