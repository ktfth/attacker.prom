import { z } from "zod";

// --- Schemas de Validação ---

export const PlaceSchema = z.object({
  title: z.string(),
  address: z.string().optional(),
  rating: z.number().optional(),
  ratingCount: z.number().optional(),
  website: z.string().optional(),
  phoneNumber: z.string().optional(),
  category: z.string().optional(),
});

export const FormattedPlaceSchema = z.object({
  title: z.string(),
  address: z.string(),
  rating: z.number().optional(),
  reviews: z.number().optional(),
  website: z.string(),
  phone: z.string(),
  category: z.string().optional(),
});

export const SerperResponseSchema = z.object({
  places: z.array(PlaceSchema).optional(),
});

// --- Tipos TypeScript ---

export type Place = z.infer<typeof PlaceSchema>;
export type FormattedPlace = z.infer<typeof FormattedPlaceSchema>;
export type SerperResponse = z.infer<typeof SerperResponseSchema>;

// --- Estado do Agente ---

export interface AgentState {
  query: string;
  real_data: string;
  selected_target: string;
  final_dossier: string;
  top_targets?: any[]; // TargetScore[] - any para evitar dependência circular
  selected_score?: any; // TargetScore
}

// --- Configuração ---

export interface Config {
  serperApiKey: string;
  googleApiKey: string;
  modelName: string;
  temperature: number;
}

// --- Erros Customizados ---

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}

export class SearchError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "SearchError";
  }
}

export class AnalysisError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "AnalysisError";
  }
}
