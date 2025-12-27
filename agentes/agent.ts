import { StateGraph, END } from "@langchain/langgraph";
import { getConfig } from "./config";
import { AgentState } from "./types";
import { SearchService } from "./search.service";
import { LLMProvider } from "./llm-provider";
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
    console.log(`✅ Configuração carregada:`);
    console.log(`   Provedor: ${config.llmProvider}`);
    console.log(`   Modelo: ${config.modelName}`);

    // --- 2. Validar Argumentos ---
    const args = process.argv.slice(2);
    const focusMode = args.includes("--focus");
    const query = args.filter((arg) => !arg.startsWith("--"))[0];

    if (!query) {
      console.error("❌ Uso: bun run agent.ts 'Nicho em Cidade'");
      console.error("   Exemplo: bun run agent.ts 'Restaurantes em São Paulo'");
      console.error("\n   Modo Focus: bun run agent.ts 'Nome da Empresa Cidade' --focus");
      console.error("   Exemplo: bun run agent.ts 'Inovar materiais de construção Perus' --focus");
      process.exit(1);
    }

    if (focusMode) {
      console.log(`\n🎯 [MODO FOCUS] Análise detalhada de empresa específica ativada`);
    }

    // --- 3. Inicializar Serviços ---
    const searchService = new SearchService(config.serperApiKey);
    const model = LLMProvider.createModel(config);

    // --- 4. Criar Nós do Grafo ---
    const researchNode = createResearchNode(searchService);
    const dossierNode = createDossierNode(model);

    // --- 5. Montar o Grafo de Trabalho ---
    const workflow = new StateGraph<AgentState>({
      channels: {
        query: { value: (x: string, y: string) => y ?? x },
        real_data: { value: (x: string, y: string) => y ?? x },
        selected_target: { value: (x: string, y: string) => y ?? x },
        final_dossier: { value: (x: string, y: string) => y ?? x },
        top_targets: { value: (x: any, y: any) => y ?? x },
        selected_score: { value: (x: any, y: any) => y ?? x },
        focus_mode: { value: (x: boolean, y: boolean) => y ?? x },
      },
    });

    workflow.addNode("research", researchNode);
    workflow.addNode("write_dossier", dossierNode);

    if (focusMode) {
      // Modo focus: research -> write_dossier (pula análise comparativa)
      workflow.setEntryPoint("research");
      workflow.addEdge("research", "write_dossier");
      workflow.addEdge("write_dossier", END);
    } else {
      // Modo normal: research -> analyze -> write_dossier
      const analysisNode = createAnalysisNode(model);
      workflow.addNode("analyze", analysisNode);
      workflow.setEntryPoint("research");
      workflow.addEdge("research", "analyze");
      workflow.addEdge("analyze", "write_dossier");
      workflow.addEdge("write_dossier", END);
    }

    const app = workflow.compile();

    // --- 6. Executar o Agente ---
    console.log(`\n🚀 [SNIPER AGENT] Iniciando análise...`);
    console.log(`📋 Query: "${query}"\n`);

    const result = await app.invoke({ query, focus_mode: focusMode });

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
