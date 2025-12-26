import { NextRequest, NextResponse } from 'next/server';
import { getSniperAgent } from '@/lib/agent-wrapper';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/analyze
 * Executa análise completa para uma query
 *
 * Body: { query: string }
 * Returns: AnalysisResult
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query é obrigatória e deve ser uma string' },
        { status: 400 }
      );
    }

    console.log(`[API] Iniciando análise para: "${query}"`);

    const agent = getSniperAgent();
    const result = await agent.analyze(query);

    console.log(`[API] Análise concluída:`, result.success ? '✅' : '❌');

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Erro na análise:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analyze
 * Retorna informações sobre o agente e configuração
 */
export async function GET() {
  try {
    const agent = getSniperAgent();
    const config = agent.getConfigInfo();

    return NextResponse.json({
      status: 'online',
      config,
      version: '2.1.0',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
