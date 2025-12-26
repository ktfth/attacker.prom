# Sniper Agent Web - Interface de Auditoria

Interface web moderna para o Sniper Agent, permitindo análises visuais e ações de resolução diretamente do navegador.

## Funcionalidades

- **Dashboard Interativo**: Interface limpa e intuitiva para executar auditorias
- **Análise em Tempo Real**: Visualização dos resultados conforme são processados
- **Sistema de Score Visual**: Indicadores de prioridade e gravidade
- **Cálculo de Perda Financeira**: Estimativa visual de receita cessante
- **Ações Integradas**:
  - Envio direto para WhatsApp
  - Composição de email
  - Cópia rápida de mensagens
- **Preview de Mensagens**: Visualização antes do envio
- **Top 5 Alvos**: Lista priorizada de oportunidades

## Arquitetura

```
web/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts    # API de análise
│   │   └── actions/route.ts    # API de ações
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Página home
│   └── globals.css             # Estilos globais
├── components/
│   ├── ui/                     # Componentes base
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── badge.tsx
│   ├── AuditForm.tsx           # Formulário de busca
│   ├── ResultCard.tsx          # Card de resultados
│   └── ActionPanel.tsx         # Painel de ações
└── lib/
    ├── agent-wrapper.ts        # Wrapper do agente
    └── utils.ts                # Utilitários
```

## Instalação

### 1. Navegar para o diretório

```bash
cd agentes/web
```

### 2. Instalar dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas chaves de API:

```env
SERPER_API_KEY="sua-chave-serper"
GOOGLE_API_KEY="sua-chave-gemini"
LLM_PROVIDER="google"
MODEL_NAME="gemini-2.0-flash"
TEMPERATURE="0.5"
```

## Executar

### Modo Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

### Modo Produção

```bash
# Build
npm run build

# Start
npm run start
```

## Uso

### 1. Executar Análise

1. Digite o nicho e cidade no campo de busca
2. Ou clique em um dos exemplos pré-definidos
3. Clique em "Iniciar Análise"
4. Aguarde o processamento (15-30 segundos)

**Exemplo de queries:**
- "Restaurantes em São Paulo"
- "Clínicas de estética em Belo Horizonte"
- "Barbearias no Rio de Janeiro"

### 2. Visualizar Resultados

A interface mostra:

**Score de Prioridade**
- Pontuação de 0-100
- Badge colorido indicando gravidade
- 🔴 CRÍTICA (≥60) | 🟠 ALTA (40-59) | 🟡 MÉDIA (20-39) | 🟢 BAIXA (<20)

**Perda Estimada Mensal**
- Cálculo em R$ da receita cessante
- Baseado em ticket médio do nicho
- Atualizado em tempo real

**Top 5 Alvos**
- Lista dos 5 negócios com maior score
- Nome, pontuação e prioridade
- Ordenados por urgência

**Dossiê Completo**
- Diagnóstico técnico
- Matemática da perda
- Script WhatsApp pronto
- Solução proposta

### 3. Executar Ações

No painel lateral:

**WhatsApp**
- Clique em "Enviar via WhatsApp"
- Abre automaticamente o WhatsApp Web
- Mensagem pré-preenchida

**Email**
- Clique em "Enviar via Email"
- Abre cliente de email padrão
- Assunto e corpo pré-preenchidos

**Copiar**
- Clique em "Copiar Mensagem"
- Copia para área de transferência
- Use onde preferir

## API Routes

### POST /api/analyze

Executa análise completa.

**Request:**
```json
{
  "query": "Restaurantes em São Paulo"
}
```

**Response:**
```json
{
  "success": true,
  "query": "Restaurantes em São Paulo",
  "selectedTarget": "...",
  "finalDossier": "...",
  "topTargets": [...],
  "selectedScore": {
    "score": 75,
    "priority": "CRÍTICA",
    "estimatedLoss": 45000
  }
}
```

### POST /api/actions

Processa ações de resolução.

**Request (WhatsApp):**
```json
{
  "action": "whatsapp",
  "target": {
    "nome": "Restaurante X",
    "telefone": "11999999999"
  },
  "message": "Olá, identifiquei..."
}
```

**Response:**
```json
{
  "success": true,
  "action": "whatsapp",
  "url": "https://wa.me/11999999999?text=..."
}
```

### GET /api/analyze

Retorna status e configuração.

**Response:**
```json
{
  "status": "online",
  "config": {
    "provider": "google",
    "model": "gemini-2.0-flash",
    "temperature": "0.5"
  },
  "version": "2.1.0"
}
```

## Tecnologias Utilizadas

### Frontend
- **Next.js 14**: Framework React com App Router
- **TypeScript**: Type safety
- **TailwindCSS**: Estilização utilitária
- **Lucide React**: Ícones

### Backend
- **Next.js API Routes**: Serverless functions
- **LangGraph**: Orquestração do agente
- **Google Gemini AI**: Análise com LLM
- **Serper.dev**: Busca no Google Maps

### UI Components
- Custom components baseados em shadcn/ui
- Totalmente responsivo
- Dark mode ready (configurável)

## Customização

### Alterar Cores

Edite `app/globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Azul padrão */
  /* Altere para suas cores */
}
```

### Adicionar Exemplos

Edite `components/AuditForm.tsx`:

```tsx
const examples = [
  'Seu novo exemplo aqui',
  // ...
]
```

### Customizar Mensagens

As mensagens são geradas pelo agente, mas você pode processá-las em `app/page.tsx`:

```tsx
const getWhatsAppMessage = () => {
  // Customize a extração aqui
}
```

## Troubleshooting

### Erro ao iniciar

```bash
# Limpar cache
rm -rf .next node_modules
npm install
npm run dev
```

### Erro de API

1. Verificar variáveis de ambiente
2. Confirmar chaves de API válidas
3. Verificar se o arquivo `../config.ts` existe

### Build falha

```bash
# Verificar tipos
npx tsc --noEmit

# Build com logs
npm run build -- --debug
```

### Porta 3000 ocupada

```bash
# Usar outra porta
PORT=3001 npm run dev
```

## Deploy

### Vercel (Recomendado)

1. Criar conta em [vercel.com](https://vercel.com)
2. Conectar repositório
3. Adicionar variáveis de ambiente
4. Deploy automático

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Outros Provedores

- **Netlify**: Funciona com Next.js
- **Railway**: Deploy simplificado
- **AWS/GCP**: Requer configuração adicional

## Limitações

- Análise única por vez (não concorrente)
- Depende de APIs externas (custos)
- Rate limits aplicáveis
- Requer Node.js 18+

## Roadmap

- [ ] Histórico de análises
- [ ] Comparação entre períodos
- [ ] Exportação para PDF/Excel
- [ ] Dashboard com métricas
- [ ] Autenticação de usuários
- [ ] Modo multi-tenancy
- [ ] Integração com CRMs
- [ ] Webhooks para automação

## Contribuindo

Melhorias bem-vindas:

1. Adicionar testes (Jest/Playwright)
2. Implementar cache de resultados
3. Criar temas customizáveis
4. Adicionar mais ações (Telegram, SMS)
5. Implementar analytics

## Suporte

Para questões técnicas:
- Consulte o README principal em `../../README.md`
- Verifique issues no repositório
- Leia a documentação do Next.js

## Licença

Mesma licença do projeto principal.
