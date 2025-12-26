import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { Config, ConfigurationError } from "./types";

/**
 * Factory para criar instâncias de modelos LLM baseado no provedor configurado
 */
export class LLMProvider {
  /**
   * Cria um modelo LLM baseado na configuração
   * @param config - Configuração do agente com informações do provedor
   * @returns Instância do modelo LLM configurado
   * @throws {ConfigurationError} Se o provedor não for suportado ou configuração inválida
   */
  static createModel(config: Config): BaseChatModel {
    switch (config.llmProvider) {
      case "google":
        return LLMProvider.createGoogleModel(config);

      case "openrouter":
        return LLMProvider.createOpenRouterModel(config);

      default:
        throw new ConfigurationError(
          `Provedor LLM não suportado: ${config.llmProvider}. Use 'google' ou 'openrouter'.`
        );
    }
  }

  /**
   * Cria um modelo Google Gemini
   */
  private static createGoogleModel(config: Config): BaseChatModel {
    if (!config.googleApiKey) {
      throw new ConfigurationError(
        "GOOGLE_API_KEY é obrigatória quando LLM_PROVIDER=google"
      );
    }

    return new ChatGoogleGenerativeAI({
      modelName: config.modelName,
      temperature: config.temperature,
      apiKey: config.googleApiKey,
    });
  }

  /**
   * Cria um modelo via OpenRouter
   */
  private static createOpenRouterModel(config: Config): BaseChatModel {
    if (!config.openRouterApiKey) {
      throw new ConfigurationError(
        "OPENROUTER_API_KEY é obrigatória quando LLM_PROVIDER=openrouter"
      );
    }

    return new ChatOpenAI({
      modelName: config.modelName,
      temperature: config.temperature,
      openAIApiKey: config.openRouterApiKey,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
      },
    });
  }

  /**
   * Valida se a configuração do provedor está correta
   */
  static validateProviderConfig(config: Config): void {
    if (config.llmProvider === "google" && !config.googleApiKey) {
      throw new ConfigurationError(
        "GOOGLE_API_KEY é obrigatória para o provedor 'google'"
      );
    }

    if (config.llmProvider === "openrouter" && !config.openRouterApiKey) {
      throw new ConfigurationError(
        "OPENROUTER_API_KEY é obrigatória para o provedor 'openrouter'"
      );
    }
  }
}
