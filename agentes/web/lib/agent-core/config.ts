import { Config, ConfigurationError, LLMProvider } from "./types";

/**
 * Valida e retorna a configuração do agente
 * @throws {ConfigurationError} Se alguma variável de ambiente obrigatória estiver faltando
 */
export function getConfig(): Config {
  const serperApiKey = process.env.SERPER_API_KEY;
  const googleApiKey = process.env.GOOGLE_API_KEY;
  const openRouterApiKey = process.env.OPENROUTER_API_KEY;
  const llmProvider = (process.env.LLM_PROVIDER || "google") as LLMProvider;

  // Validar SERPER_API_KEY (obrigatória sempre)
  if (!serperApiKey) {
    throw new ConfigurationError(
      "SERPER_API_KEY não encontrada no .env. Configure a chave da API Serper.dev"
    );
  }

  if (serperApiKey.length < 10) {
    throw new ConfigurationError("SERPER_API_KEY parece inválida (muito curta)");
  }

  // Validar provedor LLM
  if (!["google", "openrouter"].includes(llmProvider)) {
    throw new ConfigurationError(
      `LLM_PROVIDER inválido: ${llmProvider}. Use 'google' ou 'openrouter'.`
    );
  }

  // Validar chave específica do provedor
  if (llmProvider === "google") {
    if (!googleApiKey) {
      throw new ConfigurationError(
        "GOOGLE_API_KEY não encontrada no .env. Configure a chave da API Google Gemini ou mude LLM_PROVIDER para 'openrouter'"
      );
    }

    if (googleApiKey.length < 10) {
      throw new ConfigurationError("GOOGLE_API_KEY parece inválida (muito curta)");
    }
  }

  if (llmProvider === "openrouter") {
    if (!openRouterApiKey) {
      throw new ConfigurationError(
        "OPENROUTER_API_KEY não encontrada no .env. Configure a chave da API OpenRouter ou mude LLM_PROVIDER para 'google'"
      );
    }

    if (openRouterApiKey.length < 10) {
      throw new ConfigurationError("OPENROUTER_API_KEY parece inválida (muito curta)");
    }
  }

  // Modelo padrão baseado no provedor
  const defaultModel = llmProvider === "google"
    ? "gemini-2.0-flash"
    : "anthropic/claude-3.5-sonnet";

  return {
    serperApiKey,
    googleApiKey,
    openRouterApiKey,
    llmProvider,
    modelName: process.env.MODEL_NAME || defaultModel,
    temperature: parseFloat(process.env.TEMPERATURE || "0.5"),
  };
}

/**
 * Valida a configuração sem lançar exceção
 * @returns {boolean} true se a configuração é válida
 */
export function validateConfig(): boolean {
  try {
    getConfig();
    return true;
  } catch {
    return false;
  }
}
