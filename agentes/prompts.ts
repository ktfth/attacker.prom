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

  /**
   * Prompt super detalhado para modo FOCUS
   * Gera dossiê de ataque completo para uma única empresa
   */
  static getFocusModeDossierPrompt(targetScore: TargetScore): string {
    const place = targetScore.place;
    const issuesDetail = targetScore.issues
      .map(
        (issue, idx) => `
${idx + 1}. **${issue.type}** (Severidade: ${issue.severity}/10)
   - Descrição: ${issue.description}
   - Impacto: ${issue.impact}
   - Recomendação: ${issue.recommendation}
`
      )
      .join("\n");

    return `Você é um Especialista em Inteligência Comercial e Estratégia de Vendas B2B.

🎯 **MODO FOCUS ATIVADO**: Dossiê de Ataque para Empresa Específica

**EMPRESA ALVO:**
- Nome: ${place.title}
- Endereço: ${place.address}
- Rating: ${place.rating || "N/A"}/5.0 (${place.reviews || 0} reviews)
- Website: ${place.website || "❌ NÃO POSSUI"}
- Telefone: ${place.phone || "❌ NÃO INFORMADO"}
- Categoria: ${place.category || "N/A"}

**ANÁLISE QUANTITATIVA:**
- Score de Oportunidade: ${targetScore.score}/100
- Classificação: ${targetScore.priority}
- Perda Mensal Estimada: R$ ${targetScore.estimatedMonthlyLoss.toLocaleString("pt-BR")}
- Perda Anual Projetada: R$ ${(targetScore.estimatedMonthlyLoss * 12).toLocaleString("pt-BR")}

**PROBLEMAS IDENTIFICADOS (${targetScore.issues.length}):**
${issuesDetail}

---

Sua missão é criar um **DOSSIÊ DE ATAQUE COMPLETO** para essa empresa específica.

Este dossiê será usado por um time comercial para abordar o proprietário e fechar uma venda de consultoria digital.

**ESTRUTURA OBRIGATÓRIA EM MARKDOWN:**

---

# 🎯 DOSSIÊ DE ATAQUE: ${place.title}

## 📊 EXECUTIVE SUMMARY

[Resumo executivo em 3-4 linhas sobre a empresa, seus problemas críticos e o potencial de receita que está sendo perdido. Use linguagem de negócios, não técnica.]

---

## 🔍 INTELIGÊNCIA DE MERCADO

### Posicionamento Atual
- **Presença Digital**: [Avaliação qualitativa: Inexistente/Fraca/Moderada/Forte]
- **Vulnerabilidade Competitiva**: [Alta/Média/Baixa - justifique]
- **Maturidade Digital**: [Nível 1-5, sendo 1 = analógico total, 5 = totalmente digital]

### Análise SWOT Focada em Oportunidade Digital

**Forças Identificáveis:**
- [Liste 2-3 pontos fortes baseados nos dados disponíveis]

**Fraquezas Críticas:**
- [Liste TODAS as fraquezas encontradas nos problemas identificados]

**Oportunidades de Intervenção:**
- [Liste 3-5 oportunidades específicas de melhoria]

**Ameaças ao Negócio (se nada for feito):**
- [Liste 3-4 ameaças concretas: perda de market share, invisibilidade digital, etc.]

---

## 💰 MATEMÁTICA DA PERDA

### Cálculo Detalhado de Receita Cessante

**Premissas Conservadoras:**
1. **Ticket Médio do Nicho**: R$ [estime baseado na categoria - ex: ótica = R$ 350, materiais construção = R$ 450]
2. **Tráfego Digital Perdido**: [X] pessoas/dia que encontram problemas digitais
3. **Taxa de Conversão Perdida**: [Y]% dessas pessoas que desistem e vão para concorrente

**Cálculo Mensal:**
\`\`\`
Tráfego Perdido: [X] pessoas/dia × 30 dias = [total] potenciais clientes/mês
Taxa de Conversão Conservadora: [Y]%
Clientes Perdidos: [total] × [Y]% = [Z] clientes/mês
Ticket Médio: R$ [valor]

💸 PERDA MENSAL = [Z] clientes × R$ [ticket médio] = R$ ${targetScore.estimatedMonthlyLoss.toLocaleString("pt-BR")}
💸 PERDA ANUAL = R$ ${(targetScore.estimatedMonthlyLoss * 12).toLocaleString("pt-BR")}
\`\`\`

**Custo de Oportunidade (3 anos):** R$ ${(targetScore.estimatedMonthlyLoss * 36).toLocaleString("pt-BR")}

*Nota: Este cálculo NÃO inclui efeito boca-a-boca negativo, perda de posicionamento SEO e valor de lifetime do cliente.*

---

## 🚨 DIAGNÓSTICO TÉCNICO DETALHADO

[Para cada problema identificado, crie uma seção:]

${targetScore.issues
  .map(
    (issue, idx) => `
### ${idx + 1}. ${issue.type}

**O que foi identificado:**
${issue.description}

**Impacto no negócio:**
${issue.impact}

**Como isso afeta o cliente final:**
[Descreva o ponto de vista do consumidor que encontra esse problema - frustração, perda de confiança, decisão de ir ao concorrente]

**Solução técnica:**
${issue.recommendation}

**ROI estimado da correção:**
- Investimento necessário: [estime baseado na complexidade - ex: R$ 1.500 a R$ 3.000]
- Retorno mensal estimado: [Estime baseado no impacto do problema]
- Payback: [calcule quantos meses para recuperar investimento]
`
  )
  .join("\n---\n")}

---

## 🎯 ESTRATÉGIA DE ABORDAGEM COMERCIAL

### 1. Perfil do Decisor (Persona)

**Provável perfil do proprietário:**
- Geração: [Estime baseado no tipo de negócio]
- Nível de conhecimento digital: [Baixo/Médio/Alto]
- Principais dores: [Liste 3-4 dores prováveis]
- Objeções esperadas: [Liste 3-4 objeções comuns]

### 2. Estratégia de Primeiro Contato

**Canal recomendado:** WhatsApp > Telefone > Email (nessa ordem)

**Melhor horário:** [Estime baseado no tipo de negócio - ex: fora do horário de pico]

**Script de Abordagem Inicial (WhatsApp):**

\`\`\`
Olá, [Nome do Proprietário ou Nome da Empresa],

Meu nome é [Seu Nome], sou especialista em otimização de presença digital para [nicho específico].

Fiz uma análise técnica do perfil online da ${place.title} e identifiquei [PROBLEMA PRINCIPAL MAIS CRÍTICO].

Esse problema está custando aproximadamente R$ ${targetScore.estimatedMonthlyLoss.toLocaleString("pt-BR")} por mês em clientes que chegam até vocês mas desistem antes de entrar em contato.

Já ajudei [X] empresas do setor a corrigirem esse tipo de falha em menos de 72 horas.

Posso compartilhar o diagnóstico completo com você agora? São apenas 3 minutos de leitura e pode mudar completamente seus resultados nos próximos 30 dias.
\`\`\`

**Variações para diferentes respostas:**

- Se responder "Sim, pode enviar": [Enviar versão resumida deste dossiê em bullets]
- Se responder "Quanto custa?": "Antes de falar de investimento, preciso te mostrar exatamente quanto você está perdendo. Pode me dar 5 minutos hoje?"
- Se responder "Não tenho tempo": "Entendo. Justamente por isso preparei tudo em formato executivo. São 3 minutos que podem salvar R$ [valor mensal] por mês. Quando seria melhor?"
- Se não responder em 24h: [Follow-up com dado específico do diagnóstico]

### 3. Gatilhos Emocionais e Racionais

**Gatilhos Emocionais (para o proprietário):**
1. **Medo de perda**: "Enquanto conversamos, [X] clientes potenciais já desistiram"
2. **Prova social**: "Seus concorrentes diretos já corrigiram isso"
3. **Urgência**: "Cada dia de atraso = R$ [perda diária]"
4. **Orgulho ferido**: "Você trabalha duro, mas o digital não mostra isso"

**Gatilhos Racionais (ROI claro):**
1. Investimento único vs perda recorrente
2. Payback em [X] dias
3. Métricas mensuráveis (antes vs depois)
4. Prova de conceito em 48-72h

---

## 📋 PROPOSTA DE INTERVENÇÃO SNIPER

### Escopo da Consultoria

**Objetivo:** Estancar vazamento de receita em [problema principal] em 48-72 horas

**Entregas Específicas:**

${targetScore.issues
  .slice(0, 3)
  .map(
    (issue, idx) => `
${idx + 1}. **${issue.type}**
   - Solução: ${issue.recommendation}
   - Prazo: [48h/72h/1 semana - estime baseado na complexidade]
   - Resultado esperado: ${issue.impact} RESOLVIDO
`
  )
  .join("\n")}

**Metodologia:**
1. **Dia 0 (Hoje)**: Aprovação do diagnóstico + Kickoff
2. **Dia 1-2**: Implementação técnica
3. **Dia 3**: Entrega + Tutorial de uso
4. **Dias 4-30**: Acompanhamento de resultados (incluído)

**Garantias:**
- Implementação em até 72h ou devolução integral
- Aumento mínimo de [X]% em leads digitais em 30 dias
- Suporte técnico de 30 dias incluído

### Investimento e ROI

**Modelo de Precificação Sugerido:**

- **Opção 1 - Correção Emergencial**: R$ [valor] (problema mais crítico apenas)
  - Payback: [X] dias
  - ROI 30 dias: [Y]%

- **Opção 2 - Pacote Completo**: R$ [valor] (todos os ${targetScore.issues.length} problemas)
  - Payback: [X] dias
  - ROI 30 dias: [Y]%
  - Economia vs contratação individual: R$ [economia]

- **Opção 3 - Parceria de Crescimento**: R$ [valor mensal] por 6 meses
  - Correções + gestão contínua + otimização
  - ROI acumulado 6 meses: [Y]%

**Comparação Financeira:**
\`\`\`
Investimento Máximo (Opção 2): R$ [valor]
vs
Perda Mensal Atual: R$ ${targetScore.estimatedMonthlyLoss.toLocaleString("pt-BR")}

Você recupera o investimento em: [X dias/semanas]
Lucro adicional no primeiro ano: R$ [calcule]
\`\`\`

---

## 🏆 COMPARAÇÃO COMPETITIVA

### Benchmarking do Setor

**Média do Nicho [${place.category || "N/A"}] na Região:**
- Rating médio: [estime - ex: 4.2/5.0]
- Reviews médios: [estime - ex: 45]
- Taxa de presença digital completa: [estime - ex: 70%]

**${place.title} vs Concorrência:**
- Rating: ${place.rating || "N/A"}/5.0 [ABAIXO/IGUAL/ACIMA da média]
- Reviews: ${place.reviews || 0} [ABAIXO/IGUAL/ACIMA da média]
- Website: ${place.website ? "✅ POSSUI" : "❌ NÃO POSSUI"}

**Gap de Oportunidade:**
[Descreva em 2-3 parágrafos como essa empresa está atrás da concorrência e como isso representa tanto risco quanto oportunidade de crescimento acelerado]

---

## ⚡ PRÓXIMOS PASSOS (Call to Action)

### Jornada do Cliente

**PASSO 1: Confirmação de Interesse (HOJE)**
- [ ] Responder confirmando interesse em ver detalhes
- [ ] Indicar melhor horário para call de 15min

**PASSO 2: Call de Diagnóstico (AMANHÃ)**
- [ ] Apresentação do diagnóstico completo
- [ ] Tira-dúvidas técnicas
- [ ] Alinhamento de expectativas
- [ ] Escolha do pacote

**PASSO 3: Kickoff (em 24-48h)**
- [ ] Assinatura de proposta
- [ ] Acesso aos assets digitais
- [ ] Início da implementação

**PASSO 4: Entrega (em 48-72h)**
- [ ] Demonstração ao vivo
- [ ] Tutorial de uso/manutenção
- [ ] Documentação de processos

**PASSO 5: Acompanhamento (30 dias)**
- [ ] Análise de métricas semanais
- [ ] Ajustes finos
- [ ] Relatório de impacto

---

## 📞 INFORMAÇÕES DE CONTATO DO ALVO

- **Empresa**: ${place.title}
- **Endereço**: ${place.address}
- **Telefone**: ${place.phone || "❌ Não disponível - usar WhatsApp via Google Maps"}
- **Melhor forma de contato**: [WhatsApp do Google Maps > Telefone > Visita presencial]

---

## 🎯 RESUMO EXECUTIVO DO DOSSIÊ

**Por que esta empresa é um alvo prioritário:**
1. Perda mensal comprovada de R$ ${targetScore.estimatedMonthlyLoss.toLocaleString("pt-BR")}
2. ${targetScore.issues.length} problemas críticos identificados e solucionáveis
3. Score de oportunidade: ${targetScore.score}/100 (${targetScore.priority})
4. ROI da intervenção: [X]% em 30 dias
5. Probabilidade de fechamento: [Alta/Média - justifique baseado nos dados]

**Mensagem-chave para pitch:**
"${place.title} está perdendo R$ ${targetScore.estimatedMonthlyLoss.toLocaleString("pt-BR")} por mês devido a [PROBLEMA PRINCIPAL]. Podemos corrigir isso em 72h com investimento de [Y]% do que você perde em um único mês."

---

*Dossiê gerado com dados reais do Google Maps*
*Validade: 7 dias (dados podem se atualizar)*
*Confidencial - Uso interno*
`;
  }
}
