# Attacker Prom - Sistema de Auditoria e Intervenção em Negócios

Sistema completo de identificação, análise e correção de falhas operacionais em negócios físicos e digitais, baseado em metodologia de auditoria de receita cessante e automação com IA.

## Visão Geral

O **Attacker Prom** é um framework que combina estratégia de mercado, metodologia de auditoria e ferramentas de automação para identificar e corrigir vazamentos de receita em negócios. O sistema opera em duas frentes:

1. **Metodologia Sniper**: Protocolos e playbooks para identificação manual de oportunidades
2. **Sniper Agent**: Ferramenta de IA autônoma que automatiza a prospecção e análise

### Filosofia

> "Não vendemos esperança (marketing); vendemos a cessação da dor (correção de sistema)."

O projeto baseia-se no princípio de que todo negócio é um sistema, e falhas visíveis (links quebrados, atendimento lento, informações desatualizadas) são sintomas de falência operacional que custam dinheiro real.

## Estrutura do Projeto

```
attacker.prom/
├── 01_Playbook_Mestre_Auditoria.md      # Doutrina e filosofia de auditoria
├── 02_Modelos_De_Negocio_Killer.md      # Modelos de monetização
├── 03_Protocolo_Sniper.md               # Protocolo tático de execução
├── 04_Prompt_Auditor_Receita.md         # Template de prompts para IA
├── agentes/                              # Sniper Agent (automação com IA)
│   ├── agent.ts                         # Agente principal
│   ├── scoring.ts                       # Sistema de pontuação
│   ├── prompts.ts                       # Templates otimizados
│   └── ...                              # Demais arquivos do agente
├── contratos/                           # Templates de contratos
├── sniper/                              # Scripts e prompts táticos
├── exemplos/                            # Exemplos de uso
└── experimentos/                        # Testes e experimentos
```

## Componentes Principais

### 1. Playbook Mestre de Auditoria

**Arquivo:** `01_Playbook_Mestre_Auditoria.md`

Define a filosofia e o fluxo operacional em 4 fases:

- **Fase 1: Reconhecimento Silencioso** - Mapeamento de falhas sem contato
- **Fase 2: A Agulhada** - Apresentação do problema (choque de realidade)
- **Fase 3: Intervenção Cirúrgica** - Resolução rápida (24-48h)
- **Fase 4: Controle de Corrida** - Transformação em contrato recorrente

**Glossário Tático:**
- "Atrito no canal de aquisição" (não "Instagram ruim")
- "Latência cognitiva" (não "site feio")
- "Débito técnico" (não "erro")

### 2. Protocolo Sniper

**Arquivo:** `03_Protocolo_Sniper.md`

Protocolo tático para execução diária:

**Zona de Caça (Nichos Prioritários):**
- Estética/Harmonização (ticket alto)
- Odontologia especializada
- Imobiliárias
- Delivery premium

**Kill List (Falhas Críticas):**
- WhatsApp sem resposta em 15min
- Links quebrados na bio
- Formulários excessivamente longos

**Fluxo Diário:**
1. 10h-11h: Rastreamento (Meta Ads Library)
2. 11h-12h: Teste Balístico (simular cliente)
3. 14h-15h: Disparo do diagnóstico
4. 15h-17h: Negociação
5. 17h+: Implementação

### 3. Modelos de Negócio

**Arquivo:** `02_Modelos_De_Negocio_Killer.md`

Três modelos de monetização:

**Modelo 1: Sniper de Recuperação**
- Foco: Caixa rápido
- Produto: Correção pontual (R$ 400-1.500)
- ROI: Imediato

**Modelo 2: Torre de Controle**
- Foco: Renda recorrente (MRR)
- Produto: Monitoramento mensal (R$ 497/mês)
- Trabalho: 90% automatizado

**Modelo 3: Kit de Clonagem**
- Foco: Escala infinita
- Produto: Sistema completo para nicho específico
- Margem: Construir 1x, vender 1000x

### 4. Sniper Agent (Automação com IA)

**Diretório:** `agentes/`

Sistema autônomo que automatiza a prospecção e análise usando IA.

**Características:**
- Busca dados reais do Google Maps
- Sistema de scoring inteligente (0-100 pontos)
- Calcula receita cessante
- Gera relatórios prontos para envio

**Tecnologias:**
- LangGraph (orquestração)
- Google Gemini AI ou OpenRouter (análise)
- Serper.dev (busca no Google Maps)
- TypeScript + Bun

**Ver documentação completa:** `agentes/README.md`

## Instalação

### Pré-requisitos

- [Bun](https://bun.sh/) >= 1.0 (apenas para o Sniper Agent)
- Chaves de API:
  - [Serper.dev API](https://serper.dev/) (obrigatória para o agente)
  - [Google Gemini API](https://makersuite.google.com/app/apikey) OU
  - [OpenRouter API](https://openrouter.ai/) (para usar Claude, GPT-4, etc.)

### Setup do Sniper Agent

```bash
# Navegar para o diretório do agente
cd agentes

# Instalar dependências
bun install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas chaves de API
```

### Configuração Básica (.env)

```env
# Obrigatórias
SERPER_API_KEY="sua-chave-do-serper"
GOOGLE_API_KEY="sua-chave-do-gemini"

# Configurações do Modelo
LLM_PROVIDER="google"              # ou "openrouter"
MODEL_NAME="gemini-2.0-flash"      # ou "anthropic/claude-3.5-sonnet"
TEMPERATURE="0.5"
```

## Uso Rápido

### Modo Manual (Seguir Protocolos)

1. Leia o **Playbook Mestre** para entender a filosofia
2. Use o **Protocolo Sniper** para execução diária
3. Aplique os **Modelos de Negócio** conforme maturidade

### Modo Automatizado (Sniper Agent)

```bash
cd agentes

# Buscar oportunidades em restaurantes
bun run agent.ts "Restaurantes em São Paulo"

# Buscar barbearias
bun run agent.ts "Barbearias no Rio de Janeiro"

# Buscar clínicas estéticas
bun run agent.ts "Clínicas de estética em Belo Horizonte"
```

**Output:** Relatório estruturado com:
- Diagnóstico técnico
- Cálculo de perda financeira
- Script WhatsApp pronto
- Proposta de solução

### Validar Configuração

```bash
cd agentes
bun run validate.ts
```

## Fluxo de Trabalho Completo

### 1. Prospecção

**Manual:**
- Biblioteca de Anúncios do Meta
- Google Maps (busca local)
- Instagram (análise de perfis)

**Automatizado:**
```bash
bun run agent.ts "Nicho + Cidade"
```

### 2. Análise

O Sniper Agent identifica automaticamente:
- Negócios sem website (40 pontos)
- Rating baixo (20-30 pontos)
- Poucos reviews (15-25 pontos)
- Informações incompletas (10 pontos)
- Sem telefone (15 pontos)

**Priorização:**
- 🔴 CRÍTICA: Score ≥ 60
- 🟠 ALTA: Score 40-59
- 🟡 MÉDIA: Score 20-39

### 3. Abordagem

Use o script gerado pelo agente ou customize com base no `04_Prompt_Auditor_Receita.md`

**Estrutura da mensagem:**
1. Identificação do problema específico
2. Quantificação da perda (R$)
3. Proposta de correção rápida
4. Call-to-action direto

### 4. Execução

**Toolkit de Soluções Rápidas:**
- WhatsApp Business configurado
- CRM básico (Kommo/ManyChat)
- Landing page mobile-first (Carrd/Bio.site)
- Correções no Google Meu Negócio

**Prazo:** 24-48h para intervenções pontuais

### 5. Escalada para Recorrente

Após a primeira correção bem-sucedida, oferecer:
- Monitoramento contínuo
- Manutenção preventiva
- Otimização incremental

**Modelo:** Retainer mensal (R$ 497-1.500)

## Exemplos Práticos

### Exemplo 1: Clínica de Estética

**Problema Identificado:**
- Anúncio ativo (gastando R$ 3.000/mês)
- WhatsApp sem resposta em 2h
- Link da bio quebrado

**Cálculo de Perda:**
```
Ticket médio: R$ 800
Leads perdidos/dia: 3
Perda mensal: 3 × R$ 800 × 30 = R$ 72.000
```

**Solução:**
- Configurar resposta automática (WhatsApp Business)
- Corrigir link da bio
- Implementar botão direto para agendamento

**Investimento:** R$ 800
**ROI:** 1 cliente fechado já paga a solução

### Exemplo 2: Restaurante

**Problema Identificado:**
- Rating 3.8 (baixo)
- 12 reviews apenas
- Horário desatualizado no Google

**Cálculo de Perda:**
```
Clientes que desistem por rating baixo: 40%
Ticket médio: R$ 80
Perda semanal estimada: 20 × R$ 80 = R$ 1.600
Perda mensal: R$ 6.400
```

**Solução:**
- Campanha de recuperação de reviews
- Atualização de informações no GMN
- Script de follow-up pós-atendimento

## Sistema de Scoring

O Sniper Agent utiliza pontuação objetiva:

| Critério | Pontos | Gravidade |
|----------|--------|-----------|
| Sem website | 40 | CRÍTICA |
| Rating < 3.5 | 30 | ALTA |
| Rating 3.5-4.0 | 20 | MÉDIA |
| Reviews < 10 | 25 | ALTA |
| Reviews 10-30 | 15 | MÉDIA |
| Sem telefone | 15 | MÉDIA |
| Info incompleta | 10 | BAIXA |

**Prioridade Final:**
- Score ≥ 60: Ação imediata
- Score 40-59: Importante
- Score 20-39: Atenção
- Score < 20: Monitorar

## Pricing Recomendado

### Serviços Pontuais

| Serviço | Preço | Prazo |
|---------|-------|-------|
| Diagnóstico + Relatório | R$ 200-400 | 24h |
| Setup de Resgate (correção única) | R$ 400-800 | 48h |
| Combo Sniper (diagnóstico + correção + 7 dias suporte) | R$ 1.000-1.500 | 1 semana |

### Serviços Recorrentes

| Plano | Preço/mês | Escopo |
|-------|-----------|--------|
| Torre de Controle Básica | R$ 497 | Monitoramento + relatório mensal |
| Torre de Controle Pro | R$ 997 | Monitoramento + otimização + suporte |
| Kit de Clonagem (nicho) | R$ 2.000-5.000 | Setup completo one-time |

## Troubleshooting

### Problemas Comuns

**Sniper Agent não inicia:**
```bash
# Verificar instalação do Bun
bun --version

# Reinstalar dependências
cd agentes
rm -rf node_modules
bun install
```

**Erro de API:**
```bash
# Validar configuração
bun run validate.ts

# Verificar se as chaves estão corretas no .env
```

**Resultados vazios:**
- Verificar se a busca está específica (cidade + nicho)
- Confirmar que há negócios daquele tipo na região
- Checar rate limits das APIs

## Desenvolvimento e Customização

### Adicionar Novos Nichos

Edite `agentes/scoring.ts` e adicione ticket médio:

```typescript
const ticketsPorNicho: Record<string, number> = {
  'seu_nicho': 1500,
  // ...
};
```

### Customizar Prompts

Edite `agentes/prompts.ts` para ajustar templates:

```typescript
export const ANALYSIS_PROMPT = `
  // Seu prompt customizado
`;
```

### Criar Novos Templates

Adicione templates em `sniper/` ou `contratos/` conforme necessário.

## Recursos e Referências

### Documentação Interna

- `agentes/README.md` - Documentação técnica do Sniper Agent
- `agentes/CHANGELOG.md` - Histórico de versões
- `.env.example` - Template de configuração

### APIs Utilizadas

- [Serper.dev](https://serper.dev/) - Busca no Google Maps
- [Google Gemini](https://ai.google.dev/) - Análise com IA
- [OpenRouter](https://openrouter.ai/) - Acesso a múltiplos LLMs

### Ferramentas Complementares

- [WhatsApp Business](https://business.whatsapp.com/)
- [Carrd.co](https://carrd.co/) - Landing pages
- [UptimeRobot](https://uptimerobot.com/) - Monitoramento
- [ManyChat](https://manychat.com/) - Automação

## Roadmap

### Próximas Funcionalidades

- [ ] Interface web para o Sniper Agent
- [ ] Integração com CRMs populares
- [ ] Sistema de tracking de conversões
- [ ] Dashboard de métricas
- [ ] API REST para integração
- [ ] Mobile app para prospecção em campo

### Melhorias Planejadas

- [ ] Cache de resultados
- [ ] Histórico de análises
- [ ] Comparação entre períodos
- [ ] Alertas automáticos
- [ ] Geração de contratos personalizados

## Contribuindo

Para melhorias no projeto:

1. Adicione novos protocolos em arquivos markdown na raiz
2. Melhore o Sniper Agent (ver `agentes/README.md`)
3. Crie templates de scripts em `sniper/`
4. Adicione contratos em `contratos/`
5. Documente casos de sucesso em `exemplos/`

## Limitações e Avisos

### Técnicas

- Dependência de APIs externas (custos e rate limits)
- Qualidade dos dados depende do Google Maps
- Análise automatizada pode precisar validação manual

### Éticas

- Use apenas para prospecção legítima
- Respeite privacidade e LGPD
- Não faça spam ou contato invasivo
- Sempre agregue valor real ao cliente

## Licença

Este projeto é fornecido como está, sem garantias. Use por sua conta e risco.

## Suporte

Para questões técnicas:
- Consulte a documentação em cada diretório
- Verifique os arquivos de exemplo
- Leia o CHANGELOG.md para versões

## Filosofia de Uso

Lembre-se sempre:

> "Você não precisa de criatividade. Você precisa de precisão. Onde há ineficiência, há lucro."

O sistema foi projetado para ser:
- **Factual** (não emocional)
- **Financeiro** (não motivacional)
- **Cirúrgico** (não genérico)
- **Objetivo** (não opinativo)

Use a metodologia com responsabilidade e foco em agregar valor real aos negócios.
