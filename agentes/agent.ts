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
import { showMainMenu, getTargetQuery } from "./cli/menu";
import { styles } from "./cli/styles";

async function main() {
  try {
    // --- 1. Validar e Carregar Configuração ---
    const config = getConfig();
    
    // --- 2. Interface Interativa (TUI) ---
    // Verifica se passou argumentos diretos (modo legado/automação)
    const args = process.argv.slice(2);
    let query = args.filter((arg) => !arg.startsWith("--"))[0];
    let focusMode = args.includes("--focus");
    let intent: any = undefined;

    if (!query) {
      // Modo Interativo
      intent = await showMainMenu();
      
      if (intent === 'EXIT') {
        console.log(styles.info('Até logo! Sucesso nos negócios.'));
        process.exit(0);
      }

      query = await getTargetQuery(intent);
      
      // Mapeando intenções para modos
      if (intent === 'HEALTH_CHECK' || intent === 'CONTENT_CREATION') {
        focusMode = true;
      }
      // COMPETITOR_SPY e INVESTIGATION_POST usam modo normal (comparativo/investigativo)
    }

    if (!query) {
      console.log(styles.error('❌ Preciso de um nome ou nicho para começar.'));
      process.exit(1);
    }

    console.log(styles.highlight(`\n🚀 Iniciando missão: "${query}"...`));

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
        focus_mode: { value: (x?: boolean, y?: boolean) => y ?? x ?? false },
        intent: { value: (x: any, y: any) => y ?? x },
      },
    });

    workflow.addNode("research", researchNode);
    workflow.addNode("write_dossier", dossierNode);

    if (focusMode) {
      workflow.setEntryPoint("research" as any);
      workflow.addEdge("research" as any, "write_dossier" as any);
      workflow.addEdge("write_dossier" as any, END);
    } else {
      const analysisNode = createAnalysisNode(model);
      workflow.addNode("analyze" as any, analysisNode);
      workflow.setEntryPoint("research" as any);
      workflow.addEdge("research" as any, "analyze" as any);
      workflow.addEdge("analyze" as any, "write_dossier" as any);
      workflow.addEdge("write_dossier" as any, END);
    }

    const app = workflow.compile();

    // --- 6. Executar o Agente ---
    const result = await app.invoke({ query, focus_mode: focusMode, intent });

    // --- 7. Exibir Resultado ---
    console.log("\n" + "=".repeat(60));
    console.log("🎯 RELATÓRIO DO MESTRE");
    console.log("=".repeat(60) + "\n");
    console.log(result.final_dossier);
    console.log("\n" + "=".repeat(60));
    console.log(styles.success("✅ Missão cumprida!"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("API Key")) {
        console.error(styles.error("\n❌ ERRO DE CONFIGURAÇÃO:"));
        console.error(styles.warning("Parece que suas chaves de API não estão configuradas."));
        console.error("Edite o arquivo .env com suas chaves do Google Gemini e Serper.dev.");
    } else {
        console.error(styles.error("\n❌ ERRO FATAL"));
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(String(error));
        }
    }
    process.exit(1);
  }
}

main();
