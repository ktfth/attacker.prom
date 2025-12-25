import * as dotenv from "dotenv";
import { Config, ConfigurationError } from "./types";

dotenv.config();

/**
 * Valida e retorna a configuração do agente
 * @throws {ConfigurationError} Se alguma variável de ambiente obrigatória estiver faltando
 */
export function getConfig(): Config {
  const serperApiKey = process.env.SERPER_API_KEY;
  const googleApiKey = process.env.GOOGLE_API_KEY;

  if (!serperApiKey) {
    throw new ConfigurationError(
      "SERPER_API_KEY não encontrada no .env. Configure a chave da API Serper.dev"
    );
  }

  if (!googleApiKey) {
    throw new ConfigurationError(
      "GOOGLE_API_KEY não encontrada no .env. Configure a chave da API Google Gemini"
    );
  }

  // Validar formato básico das chaves
  if (serperApiKey.length < 10) {
    throw new ConfigurationError("SERPER_API_KEY parece inválida (muito curta)");
  }

  if (googleApiKey.length < 10) {
    throw new ConfigurationError("GOOGLE_API_KEY parece inválida (muito curta)");
  }

  return {
    serperApiKey,
    googleApiKey,
    modelName: process.env.MODEL_NAME || "gemini-2.0-flash",
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
