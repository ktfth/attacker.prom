import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/actions
 * Executa ações de resolução (WhatsApp, Email, etc.)
 *
 * Body: {
 *   action: 'whatsapp' | 'email' | 'copy',
 *   target: { nome, telefone?, email? },
 *   message: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, target, message } = body;

    if (!action || !target || !message) {
      return NextResponse.json(
        { error: 'action, target e message são obrigatórios' },
        { status: 400 }
      );
    }

    console.log(`[API] Ação solicitada: ${action}`);

    switch (action) {
      case 'whatsapp':
        // Gera link do WhatsApp
        const phoneNumber = target.telefone?.replace(/\D/g, '');
        if (!phoneNumber) {
          return NextResponse.json(
            { error: 'Telefone é obrigatório para ação WhatsApp' },
            { status: 400 }
          );
        }

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        return NextResponse.json({
          success: true,
          action: 'whatsapp',
          url: whatsappUrl,
          message: 'Link do WhatsApp gerado com sucesso',
        });

      case 'email':
        // Gera dados para email
        if (!target.email) {
          return NextResponse.json(
            { error: 'Email é obrigatório para ação Email' },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          action: 'email',
          data: {
            to: target.email,
            subject: `Auditoria de Receita - ${target.nome}`,
            body: message,
          },
          message: 'Dados de email preparados',
        });

      case 'copy':
        // Retorna a mensagem para copiar
        return NextResponse.json({
          success: true,
          action: 'copy',
          data: {
            message,
            target,
          },
          message: 'Mensagem pronta para copiar',
        });

      default:
        return NextResponse.json(
          { error: `Ação '${action}' não suportada` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[API] Erro na ação:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
