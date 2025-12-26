import { StateGraph, END } from "@langchain/langgraph";
import { AgentState } from "./agent-core/types";

// Importar dos arquivos locais (agent-core)
import { getConfig } from "./agent-core/config";
import { SearchService } from "./agent-core/search.service";
import { LLMProvider } from "./agent-core/llm-provider";
import {
  createResearchNode,
  createAnalysisNode,
  createDossierNode,
} from "./agent-core/nodes";

export interface AnalysisResult {
  success: boolean;
  query: string;
  realData?: string;
  selectedTarget?: string;
  finalDossier?: string;
  topTargets?: any[];
  selectedScore?: any;
  error?: string;
}

/**
 * Classe Wrapper para o Sniper Agent
 * Permite uso programático do agente sem executar via CLI
 */
export class SniperAgentWrapper {
  private app: any;
  private config: any;

  constructor() {
    // Carregar configuração
    this.config = getConfig();
  }

  /**
   * Inicializa o grafo do agente
   */
  async initialize() {
    const searchService = new SearchService(this.config.serperApiKey);
    const model = LLMProvider.createModel(this.config);

    // Criar nós
    const researchNode = createResearchNode(searchService);
    const analysisNode = createAnalysisNode(model);
    const dossierNode = createDossierNode(model);

    // Montar grafo
    const workflow = new StateGraph<AgentState>({
      channels: {
        query: { value: (x: string, y: string) => y ?? x },
        real_data: { value: (x: string, y: string) => y ?? x },
        selected_target: { value: (x: string, y: string) => y ?? x },
        final_dossier: { value: (x: string, y: string) => y ?? x },
        top_targets: { value: (x: any, y: any) => y ?? x },
        selected_score: { value: (x: any, y: any) => y ?? x },
      },
    });

    workflow.addNode("research", researchNode);
    workflow.addNode("analyze", analysisNode);
    workflow.addNode("write_dossier", dossierNode);

    workflow.setEntryPoint("research");
    workflow.addEdge("research", "analyze");
    workflow.addEdge("analyze", "write_dossier");
    workflow.addEdge("write_dossier", END);

    this.app = workflow.compile();
  }

  /**
   * Executa análise para uma query
   */
  async analyze(query: string): Promise<AnalysisResult> {
    try {
      if (!this.app) {
        await this.initialize();
      }

      const result = await this.app.invoke({ query });

      return {
        success: true,
        query,
        realData: result.real_data,
        selectedTarget: result.selected_target,
        finalDossier: result.final_dossier,
        topTargets: result.top_targets,
        selectedScore: result.selected_score,
      };
    } catch (error) {
      return {
        success: false,
        query,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Retorna informações de configuração
   */
  getConfigInfo() {
    return {
      provider: this.config.llmProvider,
      model: this.config.modelName,
      temperature: this.config.temperature,
    };
  }
}

/**
 * Singleton instance
 */
let agentInstance: SniperAgentWrapper | null = null;

export function getSniperAgent(): SniperAgentWrapper {
  if (!agentInstance) {
    agentInstance = new SniperAgentWrapper();
  }
  return agentInstance;
}
