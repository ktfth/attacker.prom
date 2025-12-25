import { StateGraph, END } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { getConfig } from "./config";
import { AgentState } from "./types";
import { SearchService } from "./search.service";
import {
  createResearchNode,
  createAnalysisNode,
  createDossierNode,
} from "./nodes";

/**
 * Sniper Agent - Sistema de Análise de Oportunidades
 *
 * Arquitetura modular baseada em LangGraph com três nós:
 * 1. Research - Coleta dados reais do Google Maps
 * 2. Analysis - Analisa e seleciona alvos prioritários
 * 3. Dossier - Gera relatório de intervenção
 */

async function main() {
  try {
    // --- 1. Validar e Carregar Configuração ---
    const config = getConfig();
    console.log(`✅ Configuração carregada: Modelo ${config.modelName}`);

    // --- 2. Validar Argumentos ---
    const query = process.argv[2];
    if (!query) {
      console.error("❌ Uso: bun run agent.ts 'Nicho em Cidade'");
      console.error("   Exemplo: bun run agent.ts 'Restaurantes em São Paulo'");
      process.exit(1);
    }

    // --- 3. Inicializar Serviços ---
    const searchService = new SearchService(config.serperApiKey);
    const model = new ChatGoogleGenerativeAI({
      modelName: config.modelName,
      temperature: config.temperature,
    });

    // --- 4. Criar Nós do Grafo ---
    const researchNode = createResearchNode(searchService);
    const analysisNode = createAnalysisNode(model);
    const dossierNode = createDossierNode(model);

    // --- 5. Montar o Grafo de Trabalho ---
    const workflow = new StateGraph<AgentState>({
      channels: {
        query: { value: (x: string, y: string) => y ?? x },
        real_data: { value: (x: string, y: string) => y ?? x },
        selected_target: { value: (x: string, y: string) => y ?? x },
        final_dossier: { value: (x: string, y: string) => y ?? x },
      },
    });

    workflow.addNode("research", researchNode);
    workflow.addNode("analyze", analysisNode);
    workflow.addNode("write_dossier", dossierNode);

    workflow.setEntryPoint("research");
    workflow.addEdge("research", "analyze");
    workflow.addEdge("analyze", "write_dossier");
    workflow.addEdge("write_dossier", END);

    const app = workflow.compile();

    // --- 6. Executar o Agente ---
    console.log(`\n🚀 [SNIPER AGENT] Iniciando análise...`);
    console.log(`📋 Query: "${query}"\n`);

    const result = await app.invoke({ query });

    // --- 7. Exibir Resultado ---
    console.log("\n" + "=".repeat(60));
    console.log("🎯 DOSSIÊ GERADO COM DADOS REAIS");
    console.log("=".repeat(60) + "\n");
    console.log(result.final_dossier);
    console.log("\n" + "=".repeat(60));
    console.log("✅ Execução concluída com sucesso!");
  } catch (error) {
    console.error("\n" + "=".repeat(60));
    console.error("❌ ERRO FATAL");
    console.error("=".repeat(60));

    if (error instanceof Error) {
      console.error(`\nTipo: ${error.name}`);
      console.error(`Mensagem: ${error.message}`);

      if (error.stack) {
        console.error(`\nStack Trace:\n${error.stack}`);
      }
    } else {
      console.error(`\nErro desconhecido: ${String(error)}`);
    }

    process.exit(1);
  }
}

main();
