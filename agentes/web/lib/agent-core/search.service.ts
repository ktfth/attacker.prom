import {
  Place,
  FormattedPlace,
  SerperResponse,
  SerperResponseSchema,
  SearchError,
} from "./types";

/**
 * Serviço de busca usando Serper.dev API
 */
export class SearchService {
  constructor(private apiKey: string) {}

  /**
   * Busca lugares no Google Maps via Serper.dev
   * @param query - Termo de busca (ex: "Restaurantes em São Paulo")
   * @param options - Opções de busca (país e idioma)
   * @returns Lista de lugares encontrados
   * @throws {SearchError} Se houver erro na busca
   */
  async searchGooglePlaces(
    query: string,
    options: { gl?: string; hl?: string } = {}
  ): Promise<Place[]> {
    if (!query || query.trim().length === 0) {
      throw new SearchError("Query de busca não pode ser vazia");
    }

    const { gl = "br", hl = "pt-br" } = options;

    const headers = new Headers();
    headers.append("X-API-KEY", this.apiKey);
    headers.append("Content-Type", "application/json");

    const body = JSON.stringify({ q: query, gl, hl });

    const requestOptions: RequestInit = {
      method: "POST",
      headers,
      body,
    };

    try {
      const response = await fetch(
        "https://google.serper.dev/places",
        requestOptions
      );

      if (!response.ok) {
        throw new SearchError(
          `Erro HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();

      // Validar resposta com Zod
      const validatedData = SerperResponseSchema.parse(data);

      return validatedData.places || [];
    } catch (error) {
      if (error instanceof SearchError) {
        throw error;
      }

      throw new SearchError(
        `Falha ao buscar dados do Serper: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
        error
      );
    }
  }

  /**
   * Formata os dados brutos para um formato mais limpo
   * @param places - Lista de lugares brutos
   * @returns Lista de lugares formatados
   */
  formatPlaces(places: Place[]): FormattedPlace[] {
    return places.map((p) => ({
      title: p.title,
      address: p.address || "Endereço não disponível",
      rating: p.rating,
      reviews: p.ratingCount,
      website: p.website || "NÃO POSSUI SITE (FALHA CRÍTICA)",
      phone: p.phoneNumber || "NÃO POSSUI TELEFONE",
      category: p.category,
    }));
  }

  /**
   * Busca e formata lugares em uma única operação
   * @param query - Termo de busca
   * @param options - Opções de busca
   * @returns JSON string com lugares formatados
   */
  async searchAndFormat(
    query: string,
    options?: { gl?: string; hl?: string }
  ): Promise<string> {
    const places = await this.searchGooglePlaces(query, options);

    if (places.length === 0) {
      return JSON.stringify(
        { message: "Nenhum local encontrado para a busca", query },
        null,
        2
      );
    }

    const formatted = this.formatPlaces(places);
    return JSON.stringify(formatted, null, 2);
  }
}
