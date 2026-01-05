import { TargetScore } from "./scoring";

/**
 * Templates de prompts otimizados para o agente (Versão: Mestre / Aliado)
 */
export class PromptTemplates {
  /**
   * Prompt para análise de alvos (usado no nó de análise - Modo Espião/Comparativo)
   */
  static getAnalysisPrompt(
    realData: string,
    topScores: TargetScore[]
  ): string {
    const scoresFormatted = topScores
      .map(
        (ts, idx) => `
CONCORRENTE/VIZINHO ${idx + 1}: ${ts.place.title}
Nota de Saúde Digital: ${ts.score}/100
Rating: ${ts.place.rating || "N/A"} | Reviews: ${ts.place.reviews || 0}
Website: ${ts.place.website}
Telefone: ${ts.place.phone}

Pontos Fortes/Fracos:
${ts.issues.map((i) => `- ${i.description} (Severidade: ${i.severity}/10)`).join("\n")}
`
      )
      .join("\n" + "=".repeat(60) + "\n");

    return `Você é um Estrategista de Negócios Locais, especializado em ajudar pequenos empresários a superarem a concorrência.
    
CONTEXTO:
O usuário quer analisar uma LISTA de negócios na região para identificar o cenário competitivo e oportunidades de melhoria imediatas.

DADOS DA REGIÃO:
${scoresFormatted}

SUA MISSÃO:
Gere um RELATÓRIO DE INVESTIGAÇÃO que cubra os seguintes pontos:
1. **Panorama Geral**: Como está a saúde digital média da região?
2. **Oportunidade Imediata**: Qual desses negócios é o 'fruto mais baixo' (mais fácil de ajudar e com maior potencial)?
3. **Sugestão de Post do Dia**: Escolha um dos negócios e crie um post rápido que eles poderiam usar HOJE para atrair clientes.

Retorne no formato Markdown, direto e profissional.`;
  }

  /**
   * Prompt para análise profunda de uma lista (Investigação)
   */
  static getInvestigationPrompt(realData: string, topScores: TargetScore[]): string {
    return this.getAnalysisPrompt(realData, topScores);
  }

  /**
   * Prompt para geração de dossiê (usado no nó de dossiê)
   * Adapta-se para Health Check (Auto-análise) ou Espionagem.
   */
  static getDossierPrompt(selectedTarget: string, targetScore?: TargetScore): string {
    // Este método genérico é usado como fallback. O ideal é usar o getFocusModeDossierPrompt para Health Check.
    return `Você é um Mentor de Negócios.
    
    Analise os dados abaixo e dê um conselho prático para o empresário:
    
    ${selectedTarget}
    
    Seja breve, encorajador e prático.`;
  }

  /**
   * Prompt para formatação de dados de negócio
   */
  static getBusinessContextPrompt(category?: string): string {
    return category ? `CONTEXTO: O negócio é do ramo de ${category}. Adapte a linguagem para termos desse mercado.` : "";
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
   * Prompt exclusivo para CRIAÇÃO DE CONTEÚDO (Social Media)
   */
  static getSocialMediaContentPrompt(targetScore: TargetScore): string {
    const place = targetScore.place;
    const issues = targetScore.issues.map(i => i.type).join(", ");

    return `Você é um Gerente de Redes Sociais criativo e estratégico.
    
    Crie um plano de conteúdo rápido para a empresa: "${place.title}" (${place.category || "Comércio Local"}).
    
    CONTEXTO DO NEGÓCIO:
    - Nota no Google: ${place.rating || "N/A"}
    - Pontos fracos identificados: ${issues}
    
    Seu objetivo é criar posts que atraiam clientes locais AGORA.
    
    Gere 3 Opções de Posts (Legenda + Ideia de Imagem):
    
    Opção 1: Foco em Prova Social (Convidando a avaliar/visitar)
    Opção 2: Foco no Produto/Serviço (Promoção ou Diferencial)
    Opção 3: Humanizado (Bastidores ou História do Dono)
    
    Formato de cada opção:
    ### Opção X: [Titulo]
    📸 **Ideia visual**: [Descreva a foto/vídeo]
    📝 **Legenda**: [Texto pronto para copiar com emojis e hashtags]
    
    Finalize com uma dica bônus de como usar o WhatsApp para divulgar esses posts.`;
  }


  /**
   * [LEGADO - Mantido por compatibilidade]
   */
  static getPersonalizedDossierPrompt(
    dominantIssue: string,
    targetScore: TargetScore
  ): string {
    // Redireciona para o novo promtp de Health Check se possível
    return this.getFocusModeDossierPrompt(targetScore);
  }

  /**
   * Prompt de DIAGNÓSTICO E PLANO DE AÇÃO (Health Check)
   * Substitui o antigo "Dossiê de Ataque". Agora é "Dossiê de Crescimento".
   */
  static getFocusModeDossierPrompt(targetScore: TargetScore): string {
    const place = targetScore.place;
    const issuesDetail = targetScore.issues
      .map(
        (issue, idx) => `
❌ PONTO DE ATENÇÃO ${idx + 1}: ${issue.type}
   - O que é: ${issue.description}
   - Impacto: ${issue.impact}
   - Como resolver: ${issue.recommendation}
`
      )
      .join("\n");

    // Lógica para definir tom
    const score = targetScore.score;
    let toneInstruction = "";
    if (score < 40) {
      toneInstruction = "O cenário é crítico, mas tem solução. Seja firme mas acolhedor. Mostre que é possível virar o jogo rápido.";
    } else if (score < 70) {
      toneInstruction = "O negócio é bom, mas tem lacunas básicas. Mostre que pequenos ajustes trarão muito resultado.";
    } else {
      toneInstruction = "O negócio é excelente. Foque em 'refinamento' e 'dominação total'.";
    }

    return `Você é um Consultor de Negócios experiente e parceiro (estilo SEBRAE moderno ou Mentor de TV).
Seu objetivo é ajudar o dono da "${place.title}" a ganhar mais dinheiro e ter mais paz.

📊 RAIO-X DO NEGÓCIO (Dados Reais do Google):
- Nome: ${place.title}
- Endereço: ${place.address}
- Nota no Google: ${place.rating || "N/A"}/5.0 (${place.reviews || 0} avaliações)
- Site: ${place.website || "❌ NÃO TEM"}
- Telefone: ${place.phone || "❌ NÃO TEM"}

NOTA DE SAÚDE DIGITAL: ${targetScore.score}/100
(Isso significa o quanto sua vitrine digital está convidativa para novos clientes)

DINHEIRO NA MESA (Estimativa de Perda):
Estimamos que você deixa de ganhar ~R$ ${targetScore.estimatedMonthlyLoss.toLocaleString("pt-BR")} por mês por causa desses detalhes.

PROBLEMAS ENCONTRADOS:
${issuesDetail}

---
SUA TAREFA:
Escreva um **PLANO DE CRESCIMENTO** direto para o dono.
Fale a língua dele (sem tecniquês desnecessário). Use emojis para facilitar a leitura.

ESTRUTURA DA RESPOSTA (Use Markdown):

# 🚀 Plano de Decolagem: ${place.title}

## 👋 Olá, empreendedor(a)!
[Uma introdução empática comentando a nota de saúde digital e o potencial do negócio. ${toneInstruction}]

## 🛡️ Onde estamos perdendo vendas (Prioridades)
[Liste os 3 principais problemas encontrados acima, mas com foco na SOLUÇÃO IMEDIATA. Ex: "Falta Site" -> "Criar Link do Zap"]

## 💡 Ideia de Ouro (Alavancagem)
[Crie UMA ideia criativa de marketing específica para o nicho de "${place.category}" que não custe dinheiro, apenas esforço.]

## 📱 Texto Pronto para Divulgação
[Escreva um texto curto e persuasivo para ele postar NO WHATSAPP STATUS hoje mesmo, convidando clientes para visitar.]

---
## 👣 Próximos Passos (Tarefa de Casa)
1. [Ação mais fácil de fazer em 5 min]
2. [Ação para fazer amanhã]
3. [Meta para daqui 30 dias]

*Sua vitrine digital é o seu vendedor 24h. Vamos cuidar dela!*
`;
  }
}

