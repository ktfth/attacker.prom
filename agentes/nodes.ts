import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { HumanMessage } from "@langchain/core/messages";
import { AgentState, AnalysisError, FormattedPlace } from "./types";
import { SearchService } from "./search.service";
import { TargetScoring, TargetScore } from "./scoring";
import { PromptTemplates } from "./prompts";

/**
 * Estado estendido para passar dados entre nós
 */
interface ExtendedAgentState extends AgentState {
  top_targets?: TargetScore[];
  selected_score?: TargetScore;
}

/**
 * Cria o nó de pesquisa (research)
 * Responsável por buscar dados reais e fazer scoring inicial
 */
export function createResearchNode(searchService: SearchService) {
  return async (
    state: ExtendedAgentState
  ): Promise<Partial<ExtendedAgentState>> => {
    const isFocusMode = state.focus_mode || false;

    if (isFocusMode) {
      console.log(
        `\n🎯 [MODO FOCUS] Buscando dados detalhados da empresa: "${state.query}"...`
      );
    } else {
      console.log(
        `\n🔍 [SNIPER] Rastreando o Google Maps Real para: "${state.query}"...`
      );
    }

    try {
      const formattedData = await searchService.searchAndFormat(state.query);
      const parsedData = JSON.parse(formattedData);

      if (parsedData.message) {
        console.log(
          `⚠️  ${parsedData.message}. Query: "${parsedData.query}"`
        );
        return {
          real_data: JSON.stringify(
            { error: "Nenhum resultado encontrado", query: state.query },
            null,
            2
          ),
        };
      }

      const places: FormattedPlace[] = parsedData;

      if (isFocusMode) {
        // Modo Focus: Pegar o primeiro resultado (empresa específica)
        if (places.length === 0) {
          return {
            real_data: JSON.stringify(
              { error: "Empresa não encontrada", query: state.query },
              null,
              2
            ),
          };
        }

        const targetPlace = places[0];
        console.log(`\n🎯 EMPRESA ENCONTRADA: ${targetPlace.title}`);
        console.log(`   📍 ${targetPlace.address}`);
        console.log(`   ⭐ Rating: ${targetPlace.rating || "N/A"} (${targetPlace.reviews || 0} reviews)`);
        console.log(`   🌐 Website: ${targetPlace.website || "Não informado"}`);
        console.log(`   📞 Telefone: ${targetPlace.phone || "Não informado"}\n`);

        // Fazer scoring detalhado da empresa
        const targetScore = TargetScoring.scoreTarget(targetPlace);

        console.log(`📊 ANÁLISE DE OPORTUNIDADES:`);
        console.log(`   Score Total: ${targetScore.score}/100 (${targetScore.priority})`);
        console.log(`   💰 Perda Mensal Estimada: R$ ${targetScore.estimatedMonthlyLoss.toLocaleString("pt-BR")}`);
        console.log(`\n   🚨 PROBLEMAS IDENTIFICADOS (${targetScore.issues.length}):\n`);

        targetScore.issues.forEach((issue, idx) => {
          console.log(`   ${idx + 1}. ${issue.type} (Severidade: ${issue.severity}/10)`);
          console.log(`      ${issue.description}`);
          console.log(`      💡 ${issue.recommendation}\n`);
        });

        console.log(`✅ [MODO FOCUS] Análise detalhada concluída. Gerando dossiê de ataque...\n`);

        return {
          real_data: formattedData,
          top_targets: [targetScore],
          selected_score: targetScore,
          selected_target: `ALVO SELECIONADO: ${targetPlace.title}\n\nDados completos analisados para dossiê de ataque.`,
        };
      } else {
        // Modo Normal: Top 5 alvos
        console.log(`📊 [SNIPER] Analisando e pontuando ${places.length} alvos...`);
        const topTargets = TargetScoring.getTopTargets(places, 5);

        // Exibir resumo dos top alvos
        console.log(`\n🎯 TOP 5 ALVOS IDENTIFICADOS:\n`);
        topTargets.forEach((target, idx) => {
          console.log(
            `${idx + 1}. ${target.place.title} - Score: ${target.score}/100 (${target.priority})`
          );
          console.log(
            `   💰 Perda Mensal: R$ ${target.estimatedMonthlyLoss.toLocaleString("pt-BR")}`
          );
          console.log(
            `   🚨 Problemas: ${target.issues.map((i) => i.type).join(", ")}\n`
          );
        });

        console.log(`✅ [SNIPER] Scoring concluído. Passando para análise LLM...\n`);

        return {
          real_data: formattedData,
          top_targets: topTargets,
        };
      }
    } catch (error) {
      console.error(
        `❌ Erro na pesquisa: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );

      return {
        real_data: JSON.stringify(
          {
            error: "Falha na busca",
            details: error instanceof Error ? error.message : "Desconhecido",
          },
          null,
          2
        ),
      };
    }
  };
}

/**
 * Cria o nó de análise (analyze)
 * Usa LLM + scoring para selecionar o melhor alvo
 */
export function createAnalysisNode(model: BaseChatModel) {
  return async (
    state: ExtendedAgentState
  ): Promise<Partial<ExtendedAgentState>> => {
    console.log(`\n🎯 [SNIPER] Análise LLM + Scoring Híbrido...`);

    // Verificar se há dados válidos
    try {
      const data = JSON.parse(state.real_data);
      if (data.error) {
        return {
          selected_target: `ERRO: Não foi possível analisar. ${data.error}`,
        };
      }
    } catch {
      return {
        selected_target: "ERRO: Dados de pesquisa inválidos ou corrompidos.",
      };
    }

    // Verificar se temos top_targets do scoring
    if (!state.top_targets || state.top_targets.length === 0) {
      return {
        selected_target: PromptTemplates.getNoDataPrompt(),
      };
    }

    // Usar o prompt otimizado
    const prompt = PromptTemplates.getAnalysisPrompt(
      state.real_data,
      state.top_targets
    );

    try {
      const response = await model.invoke([new HumanMessage(prompt)]);
      const selectedText = response.content as string;

      // Tentar identificar qual alvo foi selecionado para passar o score
      let selectedScore: TargetScore | undefined;
      for (const target of state.top_targets) {
        if (selectedText.includes(target.place.title)) {
          selectedScore = target;
          break;
        }
      }

      console.log(`✅ [SNIPER] Alvo final selecionado pelo LLM.`);
      if (selectedScore) {
        console.log(
          `   📌 ${selectedScore.place.title} (Score: ${selectedScore.score}/100)`
        );
        console.log(
          `   💰 Impacto: R$ ${selectedScore.estimatedMonthlyLoss.toLocaleString("pt-BR")}/mês`
        );
      }

      return {
        selected_target: selectedText,
        selected_score: selectedScore,
      };
    } catch (error) {
      throw new AnalysisError(
        `Falha ao analisar dados: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
        error
      );
    }
  };
}

/**
 * Cria o nó de geração de dossiê (write_dossier)
 * Gera relatório detalhado e acionável
 */
export function createDossierNode(model: BaseChatModel) {
  return async (
    state: ExtendedAgentState
  ): Promise<Partial<ExtendedAgentState>> => {
    const isFocusMode = state.focus_mode || false;

    if (isFocusMode) {
      console.log(`\n📝 [MODO FOCUS] Gerando Dossiê de Ataque Detalhado...`);
    } else {
      console.log(`\n📝 [SNIPER] Gerando Dossiê Completo...`);
    }

    // Verificar se há um alvo válido
    if (state.selected_target.startsWith("ERRO:")) {
      return {
        final_dossier: `## FALHA NA GERAÇÃO DE DOSSIÊ\n\n${state.selected_target}\n\nNão foi possível gerar o dossiê devido a erros na etapa anterior.`,
      };
    }

    // Escolher prompt personalizado se tivermos o score
    let prompt: string;

    if (isFocusMode && state.selected_score) {
      // Modo Focus: Dossiê super detalhado
      prompt = PromptTemplates.getFocusModeDossierPrompt(state.selected_score);
      console.log(`   🎯 Gerando dossiê de ataque com estratégia completa...`);
    } else if (state.selected_score) {
      // Identificar problema dominante
      const dominantIssue =
        state.selected_score.issues.length > 0
          ? state.selected_score.issues[0].type
          : "NO_WEBSITE";

      prompt = PromptTemplates.getPersonalizedDossierPrompt(
        dominantIssue,
        state.selected_score
      );

      console.log(
        `   🎯 Usando template personalizado para: ${dominantIssue}`
      );
    } else {
      // Fallback para prompt genérico
      prompt = PromptTemplates.getDossierPrompt(state.selected_target);
    }

    try {
      const response = await model.invoke([new HumanMessage(prompt)]);

      if (isFocusMode) {
        console.log(`✅ [MODO FOCUS] Dossiê de ataque gerado com sucesso.`);
      } else {
        console.log(`✅ [SNIPER] Dossiê gerado com sucesso.`);
      }

      // Adicionar footer com metadados
      const footer = `\n\n---\n\n**Metadados da Análise:**
- Query: "${state.query}"
- Modo: ${isFocusMode ? "FOCUS (Empresa Específica)" : "NORMAL (Comparativo)"}
- Alvos Analisados: ${state.top_targets?.length || "N/A"}
- Score do Alvo: ${state.selected_score?.score || "N/A"}/100
- Prioridade: ${state.selected_score?.priority || "N/A"}
- Data: ${new Date().toLocaleDateString("pt-BR")}
`;

      return {
        final_dossier: (response.content as string) + footer,
      };
    } catch (error) {
      throw new AnalysisError(
        `Falha ao gerar dossiê: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
        error
      );
    }
  };
}
