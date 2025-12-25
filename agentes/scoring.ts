import { FormattedPlace } from "./types";

/**
 * Resultado da pontuação de um alvo
 */
export interface TargetScore {
  place: FormattedPlace;
  score: number;
  issues: Issue[];
  priority: "CRÍTICA" | "ALTA" | "MÉDIA" | "BAIXA";
  estimatedMonthlyLoss: number;
}

/**
 * Problema identificado em um negócio
 */
export interface Issue {
  type: IssueType;
  severity: number; // 1-10
  description: string;
  impact: string;
  recommendation: string;
}

export type IssueType =
  | "NO_WEBSITE"
  | "NO_PHONE"
  | "LOW_RATING"
  | "FEW_REVIEWS"
  | "INCOMPLETE_INFO"
  | "POOR_REPUTATION";

/**
 * Sistema de pontuação de alvos
 */
export class TargetScoring {
  /**
   * Dados de ticket médio por categoria de negócio (em R$)
   */
  private static readonly AVERAGE_TICKETS: Record<string, number> = {
    restaurante: 80,
    "food & drink": 80,
    café: 35,
    cafeteria: 35,
    coffee: 35,
    barbearia: 50,
    barbershop: 50,
    "barber shop": 50,
    salão: 120,
    "beauty salon": 120,
    academia: 150,
    gym: 150,
    fitness: 150,
    hotel: 300,
    pousada: 250,
    consultório: 200,
    clínica: 250,
    clinic: 250,
    escritório: 500,
    office: 500,
    loja: 150,
    store: 150,
    mercado: 100,
    market: 100,
    padaria: 30,
    bakery: 30,
    farmácia: 60,
    pharmacy: 60,
    petshop: 100,
    "pet shop": 100,
    default: 100, // Fallback
  };

  /**
   * Pontua um alvo baseado em múltiplos critérios
   */
  static scoreTarget(place: FormattedPlace): TargetScore {
    const issues: Issue[] = [];
    let score = 0;

    // 1. Falta de Website (40 pontos) - CRÍTICO
    if (
      place.website.includes("NÃO POSSUI") ||
      place.website.toLowerCase().includes("não possui")
    ) {
      score += 40;
      issues.push({
        type: "NO_WEBSITE",
        severity: 10,
        description: "Negócio sem presença digital (website)",
        impact:
          "Perda estimada de 60-80% dos clientes que pesquisam online antes de visitar",
        recommendation:
          "Landing page básica com informações de contato, horários e localização",
      });
    }

    // 2. Falta de Telefone (15 pontos)
    if (
      place.phone.includes("NÃO POSSUI") ||
      place.phone.toLowerCase().includes("não possui")
    ) {
      score += 15;
      issues.push({
        type: "NO_PHONE",
        severity: 7,
        description: "Telefone não disponível publicamente",
        impact:
          "Impossibilita contato direto, gera frustração e perda de urgência",
        recommendation:
          "Adicionar telefone comercial no Google Meu Negócio e redes sociais",
      });
    }

    // 3. Rating Baixo (30 pontos se < 3.0, 20 se < 4.0)
    if (place.rating !== undefined) {
      if (place.rating < 3.0) {
        score += 30;
        issues.push({
          type: "LOW_RATING",
          severity: 9,
          description: `Avaliação crítica: ${place.rating}/5.0`,
          impact:
            "Clientes evitam ativamente. Cada 0.1 ponto abaixo de 4.0 representa ~5% de perda de conversão",
          recommendation:
            "Protocolo de recuperação de reputação: resposta a reviews, melhoria de atendimento, incentivo a novos reviews",
        });
      } else if (place.rating < 4.0) {
        score += 20;
        issues.push({
          type: "LOW_RATING",
          severity: 6,
          description: `Avaliação abaixo da média: ${place.rating}/5.0`,
          impact: "Redução de 15-25% na taxa de conversão vs concorrentes 4.5+",
          recommendation:
            "Sistema de coleta de feedback e melhoria contínua do serviço",
        });
      }
    }

    // 4. Poucos Reviews (25 pontos se < 10, 15 se < 30)
    if (place.reviews !== undefined) {
      if (place.reviews < 10) {
        score += 25;
        issues.push({
          type: "FEW_REVIEWS",
          severity: 8,
          description: `Apenas ${place.reviews} avaliações`,
          impact:
            'Negócio "invisível" para algoritmos de busca. Baixa prova social.',
          recommendation:
            "Campanha de coleta de reviews: QR codes, follow-up pós-venda, incentivos",
        });
      } else if (place.reviews < 30) {
        score += 15;
        issues.push({
          type: "FEW_REVIEWS",
          severity: 5,
          description: `Baixo volume de reviews: ${place.reviews}`,
          impact: "Falta de credibilidade comparado a concorrentes estabelecidos",
          recommendation:
            "Estratégia de aumento de reviews orgânicos e gestão de reputação",
        });
      }
    }

    // 5. Informações Incompletas (10 pontos)
    if (!place.address || place.address === "Endereço não disponível") {
      score += 10;
      issues.push({
        type: "INCOMPLETE_INFO",
        severity: 6,
        description: "Endereço não disponível",
        impact: "Dificulta localização física, reduz confiança",
        recommendation: "Completar perfil no Google Meu Negócio",
      });
    }

    // Calcular prioridade
    let priority: "CRÍTICA" | "ALTA" | "MÉDIA" | "BAIXA";
    if (score >= 60) priority = "CRÍTICA";
    else if (score >= 40) priority = "ALTA";
    else if (score >= 20) priority = "MÉDIA";
    else priority = "BAIXA";

    // Estimar perda mensal
    const estimatedMonthlyLoss = this.calculateMonthlyLoss(place, issues);

    return {
      place,
      score,
      issues,
      priority,
      estimatedMonthlyLoss,
    };
  }

  /**
   * Calcula perda mensal estimada baseada nos problemas
   */
  private static calculateMonthlyLoss(
    place: FormattedPlace,
    issues: Issue[]
  ): number {
    const ticketMedio = this.getAverageTicket(place.category);

    // Lógica de perda:
    // - Sem site: 2 clientes perdidos/dia
    // - Rating baixo (<4.0): 1 cliente perdido/dia
    // - Poucos reviews (<10): 1 cliente perdido a cada 2 dias
    // - Sem telefone: 0.5 cliente perdido/dia

    let dailyLoss = 0;

    issues.forEach((issue) => {
      switch (issue.type) {
        case "NO_WEBSITE":
          dailyLoss += 2.0;
          break;
        case "LOW_RATING":
          dailyLoss += issue.severity >= 9 ? 1.5 : 1.0;
          break;
        case "FEW_REVIEWS":
          dailyLoss += issue.severity >= 8 ? 0.5 : 0.3;
          break;
        case "NO_PHONE":
          dailyLoss += 0.5;
          break;
        case "INCOMPLETE_INFO":
          dailyLoss += 0.2;
          break;
      }
    });

    // 30 dias * clientes perdidos/dia * ticket médio
    return Math.round(30 * dailyLoss * ticketMedio);
  }

  /**
   * Retorna ticket médio estimado baseado na categoria
   */
  private static getAverageTicket(category?: string): number {
    if (!category) return this.AVERAGE_TICKETS.default;

    const categoryLower = category.toLowerCase();

    // Busca exata
    if (this.AVERAGE_TICKETS[categoryLower]) {
      return this.AVERAGE_TICKETS[categoryLower];
    }

    // Busca parcial
    for (const [key, value] of Object.entries(this.AVERAGE_TICKETS)) {
      if (categoryLower.includes(key) || key.includes(categoryLower)) {
        return value;
      }
    }

    return this.AVERAGE_TICKETS.default;
  }

  /**
   * Seleciona o melhor alvo de uma lista
   */
  static selectBestTarget(places: FormattedPlace[]): TargetScore | null {
    if (places.length === 0) return null;

    const scored = places.map((place) => this.scoreTarget(place));

    // Ordenar por score (maior primeiro)
    scored.sort((a, b) => b.score - a.score);

    return scored[0];
  }

  /**
   * Retorna top N alvos
   */
  static getTopTargets(
    places: FormattedPlace[],
    limit: number = 5
  ): TargetScore[] {
    const scored = places.map((place) => this.scoreTarget(place));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit);
  }

  /**
   * Formata um TargetScore para exibição
   */
  static formatScore(target: TargetScore): string {
    const lines = [
      `🎯 Alvo: ${target.place.title}`,
      `📍 Endereço: ${target.place.address}`,
      `⭐ Rating: ${target.place.rating || "N/A"} (${target.place.reviews || 0} reviews)`,
      `🔥 Score: ${target.score}/100 pontos`,
      `🚨 Prioridade: ${target.priority}`,
      `💰 Perda Mensal Estimada: R$ ${target.estimatedMonthlyLoss.toLocaleString("pt-BR")}`,
      ``,
      `📋 Problemas Identificados (${target.issues.length}):`,
    ];

    target.issues.forEach((issue, idx) => {
      lines.push(`\n${idx + 1}. ${issue.description}`);
      lines.push(`   Impacto: ${issue.impact}`);
      lines.push(`   Recomendação: ${issue.recommendation}`);
    });

    return lines.join("\n");
  }
}
