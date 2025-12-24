import { StateGraph, END } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import * as dotenv from "dotenv";

dotenv.config();

// --- Validação de Chaves ---
if (!process.env.SERPER_API_KEY) {
  throw new Error("❌ SERPER_API_KEY não encontrada no .env");
}
if (!process.env.GOOGLE_API_KEY) {
  throw new Error("❌ GOOGLE_API_KEY não encontrada no .env");
}

// --- 1. Definição do Estado do Grafo ---
interface AgentState {
  query: string;           
  real_data: string;       // JSON stringificado vindo do Google/Serper
  selected_target: string; 
  final_dossier: string;   
}

// --- 2. Configuração do Modelo (Gemini) ---
const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-2.0-flash",
  temperature: 0.5, // Temperatura mais baixa para ser mais analítico com dados reais
});

// --- 3. Ferramenta de Busca (Serper.dev) ---
async function searchGooglePlaces(query: string) {
  const myHeaders = new Headers();
  myHeaders.append("X-API-KEY", process.env.SERPER_API_KEY!);
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "q": query,
    "gl": "br",
    "hl": "pt-br"
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };

  try {
    const response = await fetch("https://google.serper.dev/places", requestOptions);
    const result = await response.json();
    return result.places || [];
  } catch (error) {
    console.error("Erro na busca do Serper:", error);
    return [];
  }
}

// --- 4. Definição dos Nós ---

/**
 * NÓ 1: INVESTIGADOR REAL
 * Função: Buscar dados reais no Google Maps via API.
 */
async function researchNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log(`\n🔍 [SNIPER] Rastreando o Google Maps Real para: "${state.query}"...`);
  
  const places = await searchGooglePlaces(state.query);
  
  if (places.length === 0) {
    console.log("⚠️ Nenhum local encontrado. Tentando busca genérica...");
    // Fallback ou erro poderia ser tratado aqui
    return { real_data: "Nenhum dado encontrado." };
  }

  // Formatando os dados para o LLM ler mais fácil
  const formattedData = places.map((p: any) => ({
    title: p.title,
    address: p.address,
    rating: p.rating,
    reviews: p.ratingCount,
    website: p.website || "NÃO POSSUI SITE (FALHA CRÍTICA)",
    phone: p.phoneNumber || "NÃO POSSUI TELEFONE",
    category: p.category
  }));

  console.log(`✅ [SNIPER] Encontrados ${places.length} alvos reais.`);
  return { real_data: JSON.stringify(formattedData, null, 2) };
}

/**
 * NÓ 2: ANALISTA (O CÉREBRO SNIPER)
 * Função: Ler os dados JSON reais e achar o alvo mais fraco.
 */
async function analysisNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log(`\n🎯 [SNIPER] Analisando a Kill List...`);

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

  const response = await model.invoke([new HumanMessage(prompt)]);
  return { selected_target: response.content as string };
}

/**
 * NÓ 3: AUDITOR (O GERADOR DE ATAQUE)
 * Mantém a lógica de escrita persuasiva.
 */
async function dossierNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log(`\n📝 [SNIPER] Gerando Munição de Guerra...`);

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

  const response = await model.invoke([new HumanMessage(prompt)]);
  return { final_dossier: response.content as string };
}

// --- 5. Grafo ---

const workflow = new StateGraph<AgentState>({
  channels: {
    query: { value: (x: string, y: string) => y ?? x },
    real_data: { value: (x: string, y: string) => y ?? x },
    selected_target: { value: (x: string, y: string) => y ?? x },
    final_dossier: { value: (x: string, y: string) => y ?? x },
  }
});

workflow.addNode("research", researchNode);
workflow.addNode("analyze", analysisNode);
workflow.addNode("write_dossier", dossierNode);

workflow.setEntryPoint("research");
workflow.addEdge("research", "analyze");
workflow.addEdge("analyze", "write_dossier");
workflow.addEdge("write_dossier", END);

const app = workflow.compile();

async function main() {
  const query = process.argv[2];
  if (!query) {
    console.error("❌ Uso: bun run agent.ts 'Nicho em Cidade'");
    process.exit(1);
  }

  const result = await app.invoke({ query });
  
  console.log("\n==================================================");
  console.log("🚀 DOSSIÊ GERADO COM DADOS REAIS");
  console.log("==================================================\n");
  console.log(result.final_dossier);
}

main().catch(console.error);
