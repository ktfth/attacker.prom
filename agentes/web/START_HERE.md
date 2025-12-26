# 🚀 COMECE AQUI - Interface Web do Sniper Agent

Este arquivo guiará você para começar a usar a interface web em minutos.

## ✅ Checklist Rápido

### Antes de Começar
- [ ] Node.js 18+ instalado
- [ ] Chave Serper.dev obtida
- [ ] Chave Google Gemini (ou OpenRouter) obtida

### Setup (5 minutos)
- [ ] `cd agentes/web`
- [ ] `npm install`
- [ ] `cp .env.example .env`
- [ ] Editar `.env` com suas chaves
- [ ] `npm run dev`

### Primeiro Uso (2 minutos)
- [ ] Abrir http://localhost:3000
- [ ] Testar com "Restaurantes em São Paulo"
- [ ] Aguardar resultado (~20 segundos)
- [ ] Explorar o dossiê gerado
- [ ] Testar ação de WhatsApp/Email/Copiar

## 📚 Documentação Disponível

Escolha conforme sua necessidade:

| Arquivo | Quando Usar |
|---------|-------------|
| **QUICK_START.md** | Começar em 3 passos simples |
| **WEB_SETUP.md** | Setup detalhado passo a passo |
| **README.md** | Documentação completa e referência |
| **FEATURES.md** | Entender todas funcionalidades |
| **CHANGELOG_WEB.md** | Ver histórico e futuro |

## 🎯 O Que Você Consegue Fazer

### 1. Análise Automatizada
Digite nicho + cidade e receba:
- Score de prioridade (0-100)
- Cálculo de perda mensal em R$
- Top 5 melhores alvos
- Dossiê completo de intervenção

### 2. Ações Integradas
Execute diretamente da interface:
- **WhatsApp**: Abre conversa com mensagem pronta
- **Email**: Compõe email automaticamente
- **Copiar**: Usa onde quiser

### 3. Visualização Intuitiva
- Badges coloridos por prioridade
- Métricas em destaque
- Dossiê formatado
- Interface responsiva

## 🔥 Fluxo Recomendado

### Primeira Vez
1. Leia **QUICK_START.md** (2 min)
2. Configure seguindo **WEB_SETUP.md** (5 min)
3. Teste com exemplo (2 min)
4. Explore **FEATURES.md** conforme usar

### Uso Diário
1. Abra interface (http://localhost:3000)
2. Digite "[Nicho] em [Cidade]"
3. Analise resultados
4. Execute ação (WhatsApp/Email)
5. Repita para outros nichos

### Troubleshooting
1. Veja **WEB_SETUP.md** seção "Troubleshooting"
2. Confira **README.md** seção "Troubleshooting"
3. Verifique console do navegador (F12)

## ⚡ Comandos Essenciais

```bash
# Desenvolvimento
npm run dev          # Inicia servidor (http://localhost:3000)
npm run build        # Build para produção
npm start            # Inicia produção
npm run lint         # Verifica código

# Troubleshooting
rm -rf .next node_modules  # Limpar cache
npm install                 # Reinstalar
PORT=3001 npm run dev      # Usar porta diferente
```

## 💡 Dicas Pro

1. **Queries específicas funcionam melhor**
   - ✅ "Restaurantes japoneses em São Paulo"
   - ❌ "Restaurantes"

2. **Cidades menores = menos competição**
   - Teste bairros específicos
   - Explore cidades médias

3. **Salve os dossiês**
   - Copie e cole em documento
   - Crie biblioteca de casos

4. **Experimente diferentes modelos**
   - Gemini é rápido
   - Claude é mais detalhado (via OpenRouter)

5. **Use ações diretamente**
   - WhatsApp para urgência
   - Email para formalidade
   - Copiar para flexibilidade

## 🎨 Customização Rápida

### Alterar Exemplos
Edite `components/AuditForm.tsx`:
```tsx
const examples = [
  'Seu nicho aqui',
  // ...
]
```

### Alterar Cores
Edite `app/globals.css`:
```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Sua cor */
}
```

## 📊 O Que Esperar

### Performance
- **Análise**: 15-30 segundos
- **Interface**: Carrega em <2s
- **Ações**: Instantâneas

### Resultados
- **Score**: 0-100 (quanto maior, mais urgente)
- **Perda**: Estimativa conservadora
- **Alvos**: Top 5 mais promissores
- **Dossiê**: Pronto para uso

### Custos (APIs)
- Serper: ~$0.002 por busca
- Gemini: ~$0.01 por análise
- Total: ~$0.012 por análise completa

## 🚨 Problemas Comuns

### Não inicia
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Erro de API
- Verificar chaves no `.env`
- Confirmar créditos disponíveis
- Testar chaves diretamente

### Porta ocupada
```bash
PORT=3001 npm run dev
```

### Resultados estranhos
- Usar query mais específica
- Tentar outra cidade
- Verificar se nicho existe na região

## 🎯 Próximos Passos

Após dominar o básico:

1. **Integre no fluxo**
   - Use diariamente
   - Crie rotina de prospecção
   - Meça resultados

2. **Customize**
   - Ajuste prompts (se necessário)
   - Personalize cores/branding
   - Adicione seus nichos favoritos

3. **Escale**
   - Deploy em produção (Vercel)
   - Compartilhe com equipe
   - Integre com CRM (futuro)

4. **Contribua**
   - Reporte bugs
   - Sugira melhorias
   - Compartilhe casos de sucesso

## 📞 Suporte

Precisa de ajuda?

1. **Documentação**: Leia os arquivos .md
2. **Console**: Abra F12 no navegador
3. **Logs**: Veja terminal onde rodou `npm run dev`
4. **API**: Teste http://localhost:3000/api/analyze

## ✨ Recursos Extras

- **Dark Mode**: CSS pronto, ative em globals.css
- **PWA**: Adicione manifest.json para app
- **Analytics**: Integre Google Analytics
- **SEO**: Meta tags já configuradas

## 🎉 Está Pronto!

Agora você tem:
- ✅ Interface web funcional
- ✅ API backend completa
- ✅ Documentação detalhada
- ✅ Exemplos prontos
- ✅ Ações integradas

**Comece agora:**
```bash
cd agentes/web
npm run dev
# Acesse: http://localhost:3000
```

Boa sorte com suas auditorias! 🎯
