# Upgrade do Dossiê - v1.2

## Data: 2025-12-25

### Problema Corrigido

**ANTES (v1.1):**
O dossiê era gerado com placeholders genéricos pedindo mais informações:
```markdown
Desculpe, mas notei que você não forneceu o ALVO REAL SELECIONADO...

Para gerar um Dossiê de Intervenção preciso e acionável, preciso de informações como:
1. Nome do estabelecimento
2. Localização
3. Tipo de negócio
...
```

**AGORA (v1.2):**
O dossiê é gerado automaticamente com TODOS os dados reais do Google Maps:
```markdown
## 🔍 Diagnóstico Técnico

Analisei o perfil digital da **Barbearia Silva** (Rua XV de Novembro, 123 - Perus, SP) no Google Maps.

**O que identifiquei:**
- Negócio sem presença digital (website)
- Apenas 12 avaliações

**Status Atual:**
- Rating: 3.8/5.0 com 12 avaliações
- Website: ❌ Ausente (problema crítico)
- Telefone: ✅ (11) 99999-9999
```

### O Que Foi Mudado

#### 1. Extração Automática de Dados ✅

O prompt agora extrai AUTOMATICAMENTE do `targetScore`:
- Nome do negócio
- Endereço completo
- Telefone (com indicação se não disponível)
- Website (com indicação se não disponível)
- Rating e número de reviews
- Todos os problemas identificados
- Perda mensal e anual

**Código:**
```typescript
const nomeNegocio = targetScore.place.title;
const endereco = targetScore.place.address || "Endereço não disponível";
const telefone = targetScore.place.phone || "NÃO POSSUI";
const website = targetScore.place.website || "NÃO POSSUI";
const rating = targetScore.place.rating || 0;
const reviews = targetScore.place.reviews || 0;
const perdaMensal = targetScore.estimatedMonthlyLoss;
const perdaAnual = perdaMensal * 12;
```

#### 2. Cálculos Automáticos ✅

**Ticket Médio:**
Calculado automaticamente baseado na categoria:
```typescript
if (categoria.includes('restaurante')) ticketMedio = 80;
else if (categoria.includes('barbearia')) ticketMedio = 50;
else if (categoria.includes('clínica')) ticketMedio = 250;
else if (categoria.includes('academia')) ticketMedio = 150;
```

**Clientes Perdidos:**
```typescript
const clientesPerdidosDia = Math.ceil(perdaMensal / (ticketMedio * 30));
```

#### 3. Scripts Prontos com Dados Reais ✅

**OPÇÃO 1 - WhatsApp:**
```
Olá, Barbearia Silva!

Sou especialista em auditoria digital e identifiquei uma oportunidade no perfil de vocês.

Analisei o Google Maps e vi que negócio sem presença digital (website).

Isso está custando aproximadamente R$ 15mil/mês em clientes que chegam até vocês mas desistem.

Tenho um protocolo de correção de 48h. Posso te mostrar o diagnóstico completo agora?
```

**OPÇÃO 2 - Abordagem Presencial:**
```
Olá! Acabei de passar aqui na Rua XV de Novembro, 123 - Perus, SP e fiz uma análise rápida do perfil digital de vocês.

Identifiquei 2 problema(s) que provavelmente estão fazendo vocês perderem clientes que pesquisam online.

Tenho 5 minutos para mostrar? É só uma análise rápida, sem compromisso.
```

#### 4. Informações Acionáveis ✅

**Agora inclui:**
- Endereço exato para visita presencial
- Telefone para contato direto
- Problemas específicos listados
- Recomendações baseadas nos problemas reais
- Comparação com concorrência
- Instruções de uso (horários, abordagem)

#### 5. Contexto Completo no Prompt ✅

O LLM recebe um bloco formatado com TODOS os dados:
```
DADOS REAIS DO ALVO (Google Maps):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Nome: Barbearia Silva
📮 Endereço: Rua XV de Novembro, 123 - Perus, SP
📞 Telefone: (11) 99999-9999
🌐 Website: NÃO POSSUI
⭐ Rating: 3.8/5.0 (12 avaliações)

💰 IMPACTO FINANCEIRO:
- Score de Oportunidade: 80/100
- Prioridade: CRÍTICA
- Perda Mensal Estimada: R$ 15.000
- Perda Anual: R$ 180.000

🚨 PROBLEMAS IDENTIFICADOS (2):
1. Negócio sem presença digital (website)
   • Severidade: 10/10
   • Impacto: Perda de 60-80% dos clientes que pesquisam online
   • Solução: Landing page básica com informações de contato

2. Apenas 12 avaliações
   • Severidade: 8/10
   • Impacto: Negócio invisível para algoritmos
   • Solução: Sistema de coleta de reviews pós-atendimento
```

### Estrutura Completa do Dossiê

1. **🔍 Diagnóstico Técnico**
   - Análise específica com nome e endereço
   - Problemas identificados (lista real)
   - Status atual (rating, website, telefone)

2. **💰 Impacto na Receita**
   - Ticket médio calculado
   - Clientes perdidos/dia
   - Perda mensal e anual em R$

3. **📱 Script de Abordagem**
   - OPÇÃO 1: WhatsApp (pronto para copiar)
   - OPÇÃO 2: Presencial (com endereço exato)
   - Instruções de uso

4. **⚡ Proposta de Intervenção**
   - Entregas específicas baseadas nos problemas
   - Prazo definido (48-72h)
   - Investimento estimado

5. **📊 Comparação com Concorrência**
   - Gap atual vs mercado
   - Janela de oportunidade

6. **🎯 Próximos Passos**
   - Instruções para WhatsApp
   - Instruções para presencial
   - DICA PRO com endereço

### Benefícios

✅ **100% Acionável:** Tudo pronto para usar imediatamente
✅ **Dados Reais:** Nenhum placeholder ou informação faltando
✅ **Dupla Abordagem:** WhatsApp + Presencial
✅ **Específico:** Nome, endereço, problemas reais
✅ **Profissional:** Cálculos precisos e recomendações técnicas

### Exemplo Completo

```markdown
## 🔍 Diagnóstico Técnico

Analisei o perfil digital da **Barbearia Silva** (Rua XV de Novembro, 123 - Perus, SP) no Google Maps.

**O que identifiquei:**
- Negócio sem presença digital (website)
- Apenas 12 avaliações

**Classificação Técnica:** Filtro de Expulsão de Alto Impacto

**Status Atual:**
- Rating: 3.8/5.0 com 12 avaliações
- Website: ❌ Ausente (problema crítico)
- Telefone: ✅ (11) 99999-9999

---

## 💰 Impacto na Receita

**Matemática da Perda (Conservadora):**

- **Ticket Médio do Nicho:** R$ 50
- **Clientes Perdidos por Dia:** ~10 pessoas que desistem ao encontrar os problemas
- **Período de Análise:** 30 dias

**💸 Receita Cessante Mensal: R$ 15.000**

**Anualizada: R$ 180.000**

*Nota: Esta é uma estimativa CONSERVADORA. O impacto real pode ser 2-3x maior...*

---

## 📱 Script de Abordagem (WhatsApp/Presencial)

**OPÇÃO 1 - WhatsApp:**
```
Olá, Barbearia Silva!

Sou especialista em auditoria digital e identifiquei uma oportunidade no perfil de vocês.

Analisei o Google Maps e vi que negócio sem presença digital (website).

Isso está custando aproximadamente R$ 15mil/mês em clientes que chegam até vocês mas desistem.

Tenho um protocolo de correção de 48h. Posso te mostrar o diagnóstico completo agora?
```

**OPÇÃO 2 - Abordagem Presencial:**
"Olá! Acabei de passar aqui na Rua XV de Novembro, 123 - Perus, SP e fiz uma análise rápida do perfil digital de vocês.

Identifiquei 2 problema(s) que provavelmente estão fazendo vocês perderem clientes que pesquisam online.

Tenho 5 minutos para mostrar? É só uma análise rápida, sem compromisso."

**Instruções de Uso:**
- WhatsApp: Enviar entre 9h-11h ou 14h-16h
- Presencial: Ir no estabelecimento (Rua XV de Novembro, 123 - Perus, SP)
- Ser direto e factual, sem pressão de venda
- Mostrar o diagnóstico no celular se perguntarem

---

## ⚡ Proposta de Intervenção Sniper

**Escopo:** Micro-consultoria focada APENAS nos erros críticos identificados

**Prazo:** 48-72 horas

**Entregas:**
1. Landing page básica com informações de contato, horários e localização
2. Sistema de coleta de reviews pós-atendimento (QR code + automação)

**Investimento:** R$ 400 - R$ 1.200 (baseado na complexidade da correção)

**ROI Esperado:** Estancamento imediato do vazamento + recuperação de 30-50% da receita cessante em 30 dias

---

## 📊 Comparação com Concorrência

**O Gap Atual:**
- Concorrente médio no nicho: 4.5+ rating, 50+ reviews, site completo
- **Barbearia Silva**: 3.8/5.0, 12 reviews, sem site

**Janela de Oportunidade:** Corrigir esses gaps em 48h coloca Barbearia Silva acima de 70% dos concorrentes diretos que têm os mesmos problemas.

---

## 🎯 Próximos Passos

1. **Se WhatsApp:** Aguardar resposta e agendar call de 15min
2. **Se Presencial:** Deixar cartão e follow-up em 24h
3. **Execução em 48h** (após aprovação)
4. **Acompanhamento de 30 dias** para medir resultados

**DICA PRO:** Mencione que você pode ir até o endereço (Rua XV de Novembro, 123 - Perus, SP) para resolver presencialmente se preferirem.

---

*Dossiê gerado com dados reais do Google Maps.*
*Data da análise: 25/12/2025*
*Validade: 7 dias (dados podem se atualizar)*
```

### Arquivos Modificados

- `lib/agent-core/prompts.ts` (linhas 61-244)
  - Reescrito `getDossierPrompt()` para usar dados reais
  - Simplificado `getPersonalizedDossierPrompt()`
  - Adicionado cálculos automáticos
  - Removido todos os placeholders

### Como Testar

```bash
cd agentes/web
npm run dev
# Acessar http://localhost:3000
# Buscar: "Barbearias em Perus, São Paulo"
# Verificar o dossiê gerado
```

### Checklist de Verificação

- [ ] Nome do negócio aparece no dossiê
- [ ] Endereço completo visível
- [ ] Script WhatsApp com nome real
- [ ] Script presencial com endereço
- [ ] Valores calculados (R$) corretos
- [ ] Problemas específicos listados
- [ ] Recomendações baseadas nos problemas
- [ ] Nenhum placeholder `[...]` presente

### Resultado

**Dossiê 100% acionável e específico!**

Agora é possível:
✅ Copiar e enviar no WhatsApp imediatamente
✅ Ir no endereço para abordagem presencial
✅ Ter argumentação técnica completa
✅ Mostrar cálculos precisos
✅ Apresentar soluções específicas

### Versionamento

- **v1.0.0**: Dossiê com placeholders
- **v1.1.0**: Correção de dados na interface
- **v1.2.0**: Dossiê com dados reais e acionável 🎯

---

**Status:** ✅ DOSSIÊ 100% ESPECÍFICO E ACIONÁVEL
