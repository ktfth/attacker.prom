import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { AgentState, AnalysisError } from "./types";
import { SearchService } from "./search.service";

/**
 * Cria o nó de pesquisa (research)
 */
export function createResearchNode(searchService: SearchService) {
  return async (state: AgentState): Promise<Partial<AgentState>> => {
    console.log(
      `\n🔍 [SNIPER] Rastreando o Google Maps Real para: "${state.query}"...`
    );

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

      console.log(`✅ [SNIPER] Encontrados ${parsedData.length} alvos reais.`);
      return { real_data: formattedData };
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
 */
export function createAnalysisNode(model: ChatGoogleGenerativeAI) {
  return async (state: AgentState): Promise<Partial<AgentState>> => {
    console.log(`\n🎯 [SNIPER] Analisando a Kill List...`);

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
        selected_target:
          "ERRO: Dados de pesquisa inválidos ou corrompidos.",
      };
    }

    const prompt = `
      Analise estes DADOS REAIS extraídos do Google Maps:

      ${state.real_data}

      Sua missão é selecionar A VÍTIMA PERFEITA para uma abordagem de venda de "Correção de Sistema".

      Critérios de Seleção (Ordem de Prioridade):
      1. **Falta de Site:** Se o campo 'website' diz "NÃO POSSUI SITE", é prioridade máxima.
      2. **Avaliação Baixa:** Rating abaixo de 4.0 indica clientes insatisfeitos (oportunidade de gestão de reputação).
      3. **Poucos Reviews:** Indica que o negócio é "fantasma" digital.

      Escolha UM alvo.

      Retorne apenas:
      - Nome do Negócio:
      - O Erro Técnico Real:
      - Por que atacar este alvo:
    `;

    try {
      const response = await model.invoke([new HumanMessage(prompt)]);
      console.log(`✅ [SNIPER] Alvo selecionado.`);
      return { selected_target: response.content as string };
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
 */
export function createDossierNode(model: ChatGoogleGenerativeAI) {
  return async (state: AgentState): Promise<Partial<AgentState>> => {
    console.log(`\n📝 [SNIPER] Gerando Munição de Guerra...`);

    // Verificar se há um alvo válido
    if (state.selected_target.startsWith("ERRO:")) {
      return {
        final_dossier: `## FALHA NA GERAÇÃO DE DOSSIÊ\n\n${state.selected_target}\n\nNão foi possível gerar o dossiê devido a erros na etapa anterior.`,
      };
    }

    const prompt = `
      Atue como um Auditor de Eficiência (Protocolo Sniper).

      ALVO REAL SELECIONADO:
      ${state.selected_target}

      Gere um DOSSIÊ DE INTERVENÇÃO para enviar ao dono agora.

      Estrutura Obrigatória (Markdown):

      ## 1. O Diagnóstico (A Agulhada)
      Cite o erro real encontrado (ex: "Vi no Maps que vocês não têm site linkado").
      Use linguagem técnica: "Filtro de Expulsão", "Atrito Digital".

      ## 2. A Matemática da Perda
      Faça uma estimativa conservadora de quantos clientes eles perdem por mês por esse erro.
      (Ticket Médio estimado do nicho * 1 cliente perdido a cada 2 dias).

      ## 3. O Script WhatsApp (Para Copiar e Colar)
      Curto, direto, sem "bom dia". Focado no erro.

      ## 4. A Solução Sniper
      Micro-consultoria de 48h para corrigir ESSE erro específico.
    `;

    try {
      const response = await model.invoke([new HumanMessage(prompt)]);
      console.log(`✅ [SNIPER] Dossiê gerado com sucesso.`);
      return { final_dossier: response.content as string };
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
