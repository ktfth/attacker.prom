import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { HumanMessage } from "@langchain/core/messages";
import { AgentState, AnalysisError, FormattedPlace } from "./types";
import { SearchService } from "./search.service";
import { TargetScoring, TargetScore } from "./scoring";
import { PromptTemplates } from "./prompts";

/**
 * Cria o nó de pesquisa (research)
 * Responsável por buscar dados reais e fazer scoring inicial
 */
export function createResearchNode(searchService: SearchService) {
  return async (
    state: AgentState
  ): Promise<Partial<AgentState>> => {
    const isFocusMode = state.focus_mode || false;

    if (isFocusMode) {
      console.log(
        `\n🎯 [MODO FOCUS] Buscando dados detalhados da empresa: "${state.query}"...`
      );
    } else {
      console.log(
        `\n🔍 [MESTRE] Rastreando o Google Maps Real para: "${state.query}"...`
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

        console.log(`📊 ANÁLISE DE SAÚDE DIGITAL:`);
        console.log(`   Nota: ${targetScore.score}/100 (${targetScore.priority})`);
        
        // Exibir problemas encontrados
        if (targetScore.issues.length > 0) {
           console.log(`   🚨 ${targetScore.issues.length} OPORTUNIDADES DE MELHORIA IDENTIFICADAS\n`);
        }

        return {
          real_data: formattedData,
          top_targets: [targetScore],
          selected_score: targetScore,
          selected_target: `ALVO SELECIONADO: ${targetPlace.title}\n\nDados completos analisados.`,
        };
      } else {
        // Modo Normal: Top 5 alvos
        console.log(`📊 [MESTRE] Analisando e comparando ${places.length} vizinhos...`);
        const topTargets = TargetScoring.getTopTargets(places, 5);

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
 * Usa LLM + scoring para analisar o cenário ou selecionar o melhor alvo
 */
export function createAnalysisNode(model: BaseChatModel) {
  return async (
    state: AgentState
  ): Promise<Partial<AgentState>> => {
    const isInvestigative = !state.focus_mode;
    
    if (isInvestigative) {
      console.log(`\n🕵️ [INVESTIGADOR] Analisando o cenário competitivo local...`);
    } else {
      console.log(`\n🤔 [MESTRE] A inteligência artificial está analisando o negócio...`);
    }

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

    // Usar o prompt otimizado (Investigação ou Seleção)
    const prompt = PromptTemplates.getInvestigationPrompt(
      state.real_data,
      state.top_targets
    );

    try {
      const response = await model.invoke([new HumanMessage(prompt)]);
      const analysisText = response.content as string;

      // Tentar identificar qual alvo foi selecionado (para fins de detalhamento posterior)
      let selectedScore: TargetScore | undefined;
      for (const target of state.top_targets) {
        if (analysisText.includes(target.place.title)) {
          selectedScore = target;
          break;
        }
      }

      console.log(`✅ [MESTRE] Investigação concluída.`);
      
      return {
        selected_target: analysisText,
        selected_score: selectedScore || state.top_targets[0], // Fallback para o primeiro
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
    state: AgentState
  ): Promise<Partial<AgentState>> => {
    const isFocusMode = state.focus_mode || false;
    const intent = state.intent;

    if (intent === 'CONTENT_CREATION') {
        console.log(`\n🎨 [CRIATIVO] Criando posts para redes sociais...`);
    } else if (isFocusMode) {
      console.log(`\n📝 [MESTRE] Escrevendo o Plano de Ação Personalizado...`);
    } else {
      console.log(`\n📝 [MESTRE] Compilando relatório comparativo...`);
    }

    // Verificar se há um alvo válido
    if (state.selected_target.startsWith("ERRO:")) {
      return {
        final_dossier: `## FALHA NA ANÁLISE\n\n${state.selected_target}\n\nNão foi possível gerar o material devido a erros na etapa anterior.`,
      };
    }

    // Escolher prompt personalizado
    let prompt: string;

    if (intent === 'CONTENT_CREATION' && state.selected_score) {
        prompt = PromptTemplates.getSocialMediaContentPrompt(state.selected_score);
    } else if (isFocusMode && state.selected_score) {
      // Modo Focus/Health Check: Plano de Crescimento
      prompt = PromptTemplates.getFocusModeDossierPrompt(state.selected_score);
    } else if (!isFocusMode) {
      // MODO INVESTIGAÇÃO (LISTA)
      // No modo normal/comparativo, o AnalysisNode já gerou um relatório de investigação.
      // Podemos apenas retornar esse relatório ou refiná-lo.
      // Para manter a coerência, vamos usar o selected_target que veio do AnalysisNode.
      return {
        final_dossier: state.selected_target + `\n\n---\n**Metadados da Investigação:**\n- Query: "${state.query}"\n- Data: ${new Date().toLocaleDateString("pt-BR")}`
      };
    } else if (state.selected_score) {
       prompt = PromptTemplates.getDossierPrompt(state.selected_target, state.selected_score);
    } else {
       prompt = PromptTemplates.getDossierPrompt(state.selected_target);
    }

    try {
      const response = await model.invoke([new HumanMessage(prompt)]);

      console.log(`✅ [MESTRE] Relatório gerado com sucesso.`);

      // Adicionar footer com metadados
      const footer = `\n\n---\n\n**Metadados da Análise:**
- Query: "${state.query}"
- Modo: ${intent || (isFocusMode ? "FOCUS" : "NORMAL")}
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

