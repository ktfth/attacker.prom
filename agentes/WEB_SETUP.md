# Setup da Interface Web - Instruções Completas

Este guia mostrará como configurar e usar a interface web do Sniper Agent.

## Pré-requisitos

Antes de começar, certifique-se de ter:

1. **Node.js 18+** instalado ([download](https://nodejs.org/))
2. **Chaves de API**:
   - Serper.dev API ([obter chave](https://serper.dev/))
   - Google Gemini API ([obter chave](https://makersuite.google.com/app/apikey))
   OU
   - OpenRouter API ([obter chave](https://openrouter.ai/))

## Passo 1: Navegue para o diretório

```bash
cd agentes/web
```

## Passo 2: Instale as dependências

```bash
npm install
```

Ou use yarn/pnpm:
```bash
yarn install
# ou
pnpm install
```

Aguarde a instalação (pode levar alguns minutos).

## Passo 3: Configure as variáveis de ambiente

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env`:

### Opção A: Usando Google Gemini (Recomendado)

```env
# Obrigatórias
SERPER_API_KEY="cole-sua-chave-serper-aqui"
GOOGLE_API_KEY="cole-sua-chave-gemini-aqui"

# Provedor
LLM_PROVIDER="google"

# Modelo
MODEL_NAME="gemini-2.0-flash"
TEMPERATURE="0.5"
```

### Opção B: Usando OpenRouter

```env
# Obrigatórias
SERPER_API_KEY="cole-sua-chave-serper-aqui"
OPENROUTER_API_KEY="cole-sua-chave-openrouter-aqui"

# Provedor
LLM_PROVIDER="openrouter"

# Modelo (escolha um)
MODEL_NAME="anthropic/claude-3.5-sonnet"  # Claude
# MODEL_NAME="openai/gpt-4"               # GPT-4
# MODEL_NAME="meta-llama/llama-3.1-70b"   # Llama
TEMPERATURE="0.5"
```

## Passo 4: Inicie o servidor

```bash
npm run dev
```

Você verá algo como:
```
> sniper-agent-web@1.0.0 dev
> next dev

 ✓ Ready in 2.3s
 ○ Local:        http://localhost:3000
```

## Passo 5: Acesse a interface

Abra seu navegador em: **http://localhost:3000**

## Usando a Interface

### Executar uma Análise

1. **Digite a query** no campo de busca:
   - Exemplo: "Restaurantes em São Paulo"
   - Formato: "[Nicho] em [Cidade]"

2. **Ou clique em um exemplo** pré-definido

3. **Clique em "Iniciar Análise"**

4. **Aguarde** 15-30 segundos

### Interpretando os Resultados

Após a análise, você verá:

**1. Score de Prioridade**
- Número de 0-100
- Badge colorido:
  - 🔴 CRÍTICA (≥60): Ação urgente
  - 🟠 ALTA (40-59): Importante
  - 🟡 MÉDIA (20-39): Atenção
  - 🟢 BAIXA (<20): Monitorar

**2. Perda Estimada Mensal**
- Valor em R$ da receita cessante
- Calculado com base no ticket médio do nicho

**3. Top 5 Alvos**
- Lista dos melhores alvos encontrados
- Nome, score e prioridade de cada um

**4. Dossiê Completo**
- Diagnóstico técnico
- Matemática da perda
- Script WhatsApp pronto
- Solução proposta

### Executando Ações

No painel lateral direito:

**WhatsApp**
1. Clique em "Enviar via WhatsApp"
2. Uma nova aba abrirá com WhatsApp Web
3. A mensagem estará pré-preenchida
4. Selecione o contato e envie

**Email**
1. Clique em "Enviar via Email"
2. Seu cliente de email padrão abrirá
3. Destinatário, assunto e corpo estarão preenchidos
4. Revise e envie

**Copiar**
1. Clique em "Copiar Mensagem"
2. A mensagem é copiada para área de transferência
3. Cole onde preferir (Telegram, SMS, etc.)

## Troubleshooting

### Porta 3000 já em uso

```bash
PORT=3001 npm run dev
```

Acesse: http://localhost:3001

### Erro ao iniciar

Limpe o cache:
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Erro de API

Verifique:
1. Chaves de API estão corretas no `.env`
2. Não há espaços extras ou aspas erradas
3. As chaves têm créditos/limites disponíveis

### Resultados não aparecem

1. Abra o Console do navegador (F12)
2. Verifique erros na aba Network
3. Confirme que a API respondeu com status 200

## Produção

### Build para Produção

```bash
npm run build
npm start
```

### Deploy na Vercel

1. Crie conta em [vercel.com](https://vercel.com)
2. Conecte seu repositório
3. Adicione variáveis de ambiente
4. Deploy automático

## Próximos Passos

- [ ] Testar com diferentes nichos
- [ ] Experimentar ações de WhatsApp/Email
- [ ] Personalizar mensagens
- [ ] Ajustar scores conforme necessário
- [ ] Integrar com seu CRM (futuro)

## Suporte

- **Documentação completa**: `web/README.md`
- **Guia rápido**: `web/QUICK_START.md`
- **README principal**: `../../README.md`

## Dicas

1. **Use queries específicas**: "Restaurantes japoneses em São Paulo" funciona melhor que só "Restaurantes"
2. **Teste diferentes cidades**: Cidades menores têm menos competição
3. **Salve os dossiês**: Copie e cole em um documento para referência futura
4. **Experimente modelos**: Teste Gemini vs Claude para ver qual gera melhores mensagens

Pronto! Você está configurado para usar a interface web do Sniper Agent.
