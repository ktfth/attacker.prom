# Sniper Agent - Sistema de Análise de Oportunidades

Sistema autônomo baseado em LangGraph que analisa dados reais do Google Maps para identificar oportunidades de mercado e gerar relatórios de intervenção.

## 📋 Arquitetura

O agente utiliza uma arquitetura modular com três nós principais:

```
┌─────────────┐       ┌──────────────┐       ┌─────────────────┐
│   Research  │  -->  │   Analysis   │  -->  │  Write Dossier  │
│  (Coleta)   │       │  (Análise)   │       │   (Relatório)   │
└─────────────┘       └──────────────┘       └─────────────────┘
```

### Componentes

1. **Research Node**: Busca dados reais via API Serper.dev (Google Maps) + Sistema de Scoring
2. **Analysis Node**: Análise Híbrida (Scoring Algorítmico + Gemini AI)
3. **Dossier Node**: Gera relatório estruturado em Markdown com templates personalizados

## 🎯 Funcionalidades Avançadas

### Sistema de Scoring Inteligente

O agente utiliza um **sistema de pontuação objetiva** para avaliar alvos:

**Critérios de Pontuação (0-100 pontos):**
- ❌ **Sem Website**: 40 pontos (problema CRÍTICO)
- 📱 **Sem Telefone**: 15 pontos
- ⭐ **Rating Baixo**: 20-30 pontos (dependendo da gravidade)
- 📝 **Poucos Reviews**: 15-25 pontos (< 30 reviews)
- ℹ️ **Info Incompleta**: 10 pontos

**Prioridades Automáticas:**
- 🔴 **CRÍTICA**: Score ≥ 60 (ação urgente)
- 🟠 **ALTA**: Score 40-59 (importante)
- 🟡 **MÉDIA**: Score 20-39 (atenção)
- 🟢 **BAIXA**: Score < 20 (monitorar)

### Cálculo de Receita Cessante

O agente estima **perdas financeiras mensais** baseado em:

1. **Ticket Médio por Nicho** (database com 20+ categorias)
2. **Gravidade dos Problemas** (algoritmo proprietário)
3. **Volume de Clientes Perdidos** (estimativa conservadora)

**Fórmula:**
```
Perda Mensal = Σ(Clientes Perdidos/Dia × Ticket Médio × 30 dias)
```

### Análise Híbrida (AI + Algoritmo)

- **Fase 1**: Algoritmo pontua objetivamente todos os alvos
- **Fase 2**: LLM (Gemini) escolhe entre top 5 baseado em contexto
- **Resultado**: Decisão otimizada (precisão + nuance)

## 🚀 Instalação

### Pré-requisitos

- [Bun](https://bun.sh/) >= 1.0
- Chaves de API:
  - [Google Gemini API](https://makersuite.google.com/app/apikey)
  - [Serper.dev API](https://serper.dev/)

### Setup

```bash
# Instalar dependências
bun install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas chaves de API
```

## ⚙️ Configuração

Edite o arquivo `.env`:

```env
# Obrigatórias
GOOGLE_API_KEY="sua-chave-do-gemini"
SERPER_API_KEY="sua-chave-do-serper"

# Opcionais
MODEL_NAME="gemini-2.0-flash"    # Modelo Gemini a usar
TEMPERATURE="0.5"                # Temperatura (0.0-1.0)
```

## 🎯 Uso

### Execução Básica

```bash
bun run agent.ts "Restaurantes em São Paulo"
```

### Outros Exemplos

```bash
# Buscar barbearias
bun run agent.ts "Barbearias no Rio de Janeiro"

# Buscar cafeterias
bun run agent.ts "Cafeterias em Belo Horizonte"

# Buscar academias
bun run agent.ts "Academias em Curitiba"
```

## 📁 Estrutura do Projeto

```
agentes/
├── agent.ts              # Ponto de entrada principal
├── config.ts             # Gerenciamento de configuração
├── types.ts              # Tipos TypeScript e schemas Zod
├── search.service.ts     # Serviço de busca (Serper API)
├── scoring.ts            # ⭐ Sistema de pontuação de alvos
├── prompts.ts            # ⭐ Templates de prompts otimizados
├── nodes.ts              # Nós do grafo LangGraph (refatorado)
├── validate.ts           # Script de validação de ambiente
├── list_models.ts        # Utilitário para listar modelos
├── package.json          # Dependências
├── .env.example          # Template de configuração
├── .env                  # Configuração (não versionado)
├── README.md             # Esta documentação
└── CHANGELOG.md          # Histórico de versões
```

**Novos Módulos (⭐):**
- `scoring.ts`: Sistema de scoring com 5 critérios + cálculo de receita cessante
- `prompts.ts`: Templates profissionais personalizados por tipo de problema

## 🔧 Arquitetura Técnica

### Tecnologias Utilizadas

- **LangGraph**: Orquestração de fluxo de trabalho
- **LangChain**: Framework para aplicações com LLMs
- **Gemini AI**: Modelo de linguagem (Google)
- **Serper.dev**: API de busca no Google Maps
- **TypeScript**: Linguagem principal
- **Zod**: Validação de schemas
- **Bun**: Runtime e gerenciador de pacotes

### Fluxo de Dados

```typescript
Input: "Restaurantes em São Paulo"
  ↓
Research Node:
  - Busca no Google Maps via Serper.dev
  - Formata dados (website, telefone, rating, reviews)
  - Output: JSON com lista de lugares
  ↓
Analysis Node:
  - Analisa dados com Gemini AI
  - Seleciona alvo prioritário
  - Critérios: falta de site, rating baixo, poucos reviews
  - Output: Descrição do alvo selecionado
  ↓
Dossier Node:
  - Gera relatório estruturado
  - Seções: Diagnóstico, Matemática da Perda, Script, Solução
  - Output: Markdown completo
  ↓
Final: Relatório exibido no console
```

### Tratamento de Erros

O sistema implementa validações em múltiplas camadas:

1. **Configuração**: Valida chaves de API na inicialização
2. **Busca**: Trata erros de rede e respostas vazias
3. **Validação**: Usa Zod para validar schemas de dados
4. **Análise**: Captura erros do LLM e fornece fallbacks
5. **Global**: Captura exceções e exibe mensagens estruturadas

### Classes de Erro Customizadas

```typescript
ConfigurationError  // Problemas de configuração
SearchError         // Falhas na busca
AnalysisError       // Erros na análise com LLM
```

## 🧪 Desenvolvimento

### Listar Modelos Disponíveis

```bash
bun run list_models.ts
```

### Verificar Tipagem

```bash
bun run --watch agent.ts "Teste"
```

### Restaurar Versão Original

O backup da versão original está em `agent.ts.backup`:

```bash
cp agent.ts.backup agent.ts
```

## 📊 Output Esperado

O agente gera um dossiê em Markdown com a seguinte estrutura:

```markdown
## 1. O Diagnóstico (A Agulhada)
[Análise técnica do problema encontrado]

## 2. A Matemática da Perda
[Estimativa de custo de oportunidade]

## 3. O Script WhatsApp (Para Copiar e Colar)
[Mensagem pronta para contato]

## 4. A Solução Sniper
[Proposta de correção]
```

## ⚠️ Limitações

- Depende de APIs externas (Serper.dev e Google Gemini)
- Custos associados ao uso das APIs
- Rate limits aplicáveis
- Qualidade dos dados depende da disponibilidade no Google Maps

## 📄 Licença

Este projeto é fornecido como está, sem garantias.

## 🤝 Contribuindo

Para melhorias:

1. Crie tipos mais específicos
2. Adicione testes unitários
3. Implemente cache de resultados
4. Adicione logging estruturado
5. Crie interface CLI mais robusta

## 📞 Suporte

Para questões técnicas, consulte a documentação das dependências:

- [LangGraph Docs](https://langchain-ai.github.io/langgraph/)
- [LangChain Docs](https://js.langchain.com/docs/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Serper.dev Docs](https://serper.dev/docs)
