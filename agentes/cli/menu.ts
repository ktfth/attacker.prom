import { select, input } from '@inquirer/prompts';
import { styles, banner } from './styles';

export type UserIntent = 
  | 'HEALTH_CHECK'
  | 'COMPETITOR_SPY'
  | 'CONTENT_CREATION'
  | 'INVESTIGATION_POST'
  | 'EXIT';

export async function showMainMenu(): Promise<UserIntent> {
  console.clear();
  console.log(banner);
  console.log(styles.info(' Bem-vindo ao seu Aliado Digital.\n'));

  const answer = await select({
    message: 'O que vamos fazer pelo seu negócio hoje?',
    choices: [
      {
        name: '🏥 Fazer um Check-up da minha empresa',
        value: 'HEALTH_CHECK',
        description: 'Auto-diagnóstico: Descubra erros que te fazem perder dinheiro.'
      },
      {
        name: '🕵️ Investigação de Mercado (Concorrentes)',
        value: 'COMPETITOR_SPY',
        description: 'Relatório completo de quem domina sua região.'
      },
      {
        name: '📢 Criativo do Dia (Post Pronto)',
        value: 'CONTENT_CREATION',
        description: 'Gere posts estratégicos para Instagram/WhatsApp agora.'
      },
      {
        name: '🚀 Estratégia Dominante (Lista + Posts)',
        value: 'INVESTIGATION_POST',
        description: 'Investiga o nicho, seleciona o melhor e cria posts para o mercado.'
      },
      {
        name: '🚪 Sair',
        value: 'EXIT',
      },
    ],
  });

  return answer as UserIntent;
}

export async function getTargetQuery(intent: UserIntent): Promise<string> {
  if (intent === 'EXIT') return '';

  let message = '';
  switch (intent) {
    case 'HEALTH_CHECK':
      message = 'Qual o nome da sua empresa (e cidade)?';
      break;
    case 'COMPETITOR_SPY':
    case 'INVESTIGATION_POST':
      message = 'Qual ramo e região você quer investigar? (ex: Academia em Perus)';
      break;
    case 'CONTENT_CREATION':
      message = 'Para qual empresa vamos criar conteúdo?';
      break;
  }

  return await input({ message });
}
