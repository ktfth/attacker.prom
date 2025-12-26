# Funcionalidades da Interface Web

Documentação visual das funcionalidades disponíveis na interface web do Sniper Agent.

## Visão Geral

A interface web oferece uma experiência completa para análise de oportunidades de negócios, desde a busca até a execução de ações de resolução.

## 1. Dashboard Principal

### Header
- **Logo e Nome**: Sniper Agent
- **Tagline**: Sistema de Auditoria e Intervenção
- **Design**: Limpo, profissional, com sticky header

### Cards de Features (Antes da Análise)
Três cards informativos sobre as capacidades:

**Card 1: Análise Rápida**
- Ícone: Raio (⚡)
- Descrição: Identifica oportunidades em segundos usando dados reais

**Card 2: Score Inteligente**
- Ícone: Gráfico crescente (📈)
- Descrição: Sistema de pontuação objetiva (0-100 pontos)

**Card 3: Ações Práticas**
- Ícone: Escudo (🛡️)
- Descrição: Scripts prontos e cálculo de receita cessante

## 2. Formulário de Busca

### Componentes
- **Título**: "Nova Auditoria" com ícone de lupa
- **Campo de entrada**:
  - Placeholder: "Ex: Restaurantes em São Paulo"
  - Validação em tempo real
  - Disabled durante análise

- **Botões de exemplo**:
  - "Restaurantes em São Paulo"
  - "Clínicas de estética em Belo Horizonte"
  - "Barbearias no Rio de Janeiro"
  - "Academias em Curitiba"
  - Click rápido para preencher

- **Botão principal**:
  - Normal: "Iniciar Análise" (ícone lupa)
  - Carregando: "Analisando..." (spinner animado)
  - Estados visuais claros

### Estados
1. **Vazio**: Pronto para entrada
2. **Preenchido**: Botão habilitado
3. **Carregando**: Spinner + texto + disabled
4. **Erro**: Border vermelho + mensagem

## 3. Visualização de Resultados

### Layout
- **Desktop**: Grid 2/3 + 1/3 (resultados + ações)
- **Mobile**: Stack vertical

### Card de Header
- **Título**: "Resultado da Análise"
- **Ícone**: Alvo (🎯)
- **Badge de prioridade**: Colorido conforme gravidade
- **Query**: Texto da busca executada

### Cards de Métricas

**Score de Prioridade**
- Título: "Score de Prioridade" + ícone ⚠️
- Valor: Número grande (0-100)
- Subtítulo: "Pontuação de 0-100"
- Design: Destaque visual

**Perda Estimada Mensal**
- Título: "Perda Estimada Mensal" + ícone 📉
- Valor: R$ formatado em vermelho
- Subtítulo: "Receita cessante por mês"
- Design: Impacto visual

### Top 5 Alvos

**Card de Lista**
- Título: "Top 5 Alvos Identificados"
- Cada item:
  - Nome do negócio
  - Badge de score (ex: "75 pts")
  - Badge de prioridade (colorido)
  - Background: Secondary/50
  - Espaçamento: 2 unidades

**Cores de Prioridade:**
- 🔴 CRÍTICA: bg-red-500
- 🟠 ALTA: bg-orange-500
- 🟡 MÉDIA: bg-yellow-500
- 🟢 BAIXA: bg-green-500

### Dossiê de Intervenção

**Card de Conteúdo**
- Título: "Dossiê de Intervenção" + ícone 📄
- Conteúdo:
  - Formatado em markdown
  - Fonte monoespaçada
  - Background: Secondary/30
  - Scrollable se necessário
  - Seções:
    1. O Diagnóstico
    2. A Matemática da Perda
    3. O Script WhatsApp
    4. A Solução Sniper

## 4. Painel de Ações

### Header
- Título: "Ações de Resolução"
- Descrição: "Escolha como entrar em contato com [Nome]"

### Botões de Ação

**WhatsApp** (se telefone disponível)
- Estilo: Primary (azul)
- Ícone: MessageCircle + ExternalLink
- Texto: "Enviar via WhatsApp"
- Ação: Abre WhatsApp Web em nova aba

**Email** (se email disponível)
- Estilo: Outline
- Ícone: Mail + ExternalLink
- Texto: "Enviar via Email"
- Ação: Abre cliente de email padrão

**Copiar** (sempre disponível)
- Estilo: Secondary
- Ícone: Copy (muda para Check após copiar)
- Texto: "Copiar Mensagem" / "Copiado!"
- Ação: Copia para clipboard

### Preview da Mensagem
- Background: Secondary/30
- Label: "Preview da Mensagem:"
- Conteúdo: Texto scrollable (max-height)
- Formatação: Preserva quebras de linha

### Informações do Alvo
- Border: Card style
- Campos:
  - **Nome**: Sempre presente
  - **Telefone**: Se disponível
  - **Email**: Se disponível
- Estilo: Texto pequeno, compacto

## 5. Card de Estatísticas

Sidebar com informações rápidas:

- **Query**: Texto da busca
- **Status**: ✓ Concluído (verde)
- **Alvos Encontrados**: Número total

Design:
- Compacto
- Flexbox space-between
- Text muted para labels

## 6. Footer

- Versão: "Sniper Agent v2.1.0"
- Descrição: "Sistema de Auditoria de Receita Cessante"
- Tecnologia: "Powered by LangGraph + Google Gemini AI"
- Centralizado, texto muted

## 7. Estados da Aplicação

### Loading
- Spinner animado no botão
- Formulário disabled
- Feedback visual claro

### Success
- Transição suave para resultados
- Cards aparecem progressivamente
- Cores e badges indicativos

### Error
- Card vermelho com mensagem
- Título: "Erro na Análise"
- Conteúdo: Descrição do erro
- Permite nova tentativa

## 8. Responsividade

### Desktop (≥1024px)
- Grid 2 colunas
- Sidebar fixa
- Features em 3 colunas

### Tablet (768px-1023px)
- Grid 2 colunas adaptativo
- Sidebar abaixo
- Features em 2 colunas

### Mobile (<768px)
- Stack vertical
- Full width
- Features em 1 coluna
- Touch-friendly (44px+ targets)

## 9. Acessibilidade

- **Contraste**: WCAG AA compliant
- **Foco**: Ring visível em todos elementos
- **Screen readers**: Labels apropriados
- **Keyboard**: Totalmente navegável
- **Loading**: Anúncios de estado

## 10. Interações

### Hover States
- Botões: Mudança de cor
- Cards: Leve elevação (shadow)
- Links: Sublinhado

### Click Feedback
- Botões: Escala 0.98
- Loading: Spinner imediato
- Copiar: Ícone muda por 2s

### Transições
- Smooth: 200-300ms
- Easing: ease-in-out
- Properties: colors, opacity, transform

## Performance

### Otimizações
- **SSR**: Server-side rendering
- **Code splitting**: Por rota
- **Lazy loading**: Componentes pesados
- **Debouncing**: Input fields
- **Caching**: Respostas da API (futuro)

### Métricas Alvo
- **FCP**: < 1.5s
- **LCP**: < 2.5s
- **TTI**: < 3.5s
- **CLS**: < 0.1

## Segurança

- **API Keys**: Server-side only
- **Sanitização**: Inputs validados
- **CORS**: Configurado apropriadamente
- **Rate limiting**: Implementável
- **HTTPS**: Obrigatório em produção

## Customização Futura

### Temas
- [ ] Dark mode completo
- [ ] Customização de cores
- [ ] Logo personalizado

### Features
- [ ] Histórico de análises
- [ ] Favoritos
- [ ] Exportação PDF
- [ ] Comparação de períodos
- [ ] Gráficos e charts

### Integrações
- [ ] Webhook notifications
- [ ] CRM integration
- [ ] Calendário (agendamento)
- [ ] Analytics dashboard
- [ ] Multi-user support

## Fluxo de Usuário Ideal

1. **Chegada**: Vê features + formulário
2. **Busca**: Digita ou clica exemplo
3. **Análise**: Aguarda 15-30s (feedback visual)
4. **Resultados**: Explora score + dossiê
5. **Ação**: Escolhe WhatsApp/Email/Copiar
6. **Contato**: Executa abordagem
7. **Nova busca**: Repete processo

Tempo total: ~2-3 minutos por análise
