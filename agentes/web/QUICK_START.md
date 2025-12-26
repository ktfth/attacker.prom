# Guia Rápido - Sniper Agent Web

Comece a usar a interface web em 3 passos.

## 1. Instalar

```bash
cd agentes/web
npm install
```

## 2. Configurar

```bash
cp .env.example .env
```

Edite `.env`:
```env
SERPER_API_KEY="sua-chave-aqui"
GOOGLE_API_KEY="sua-chave-aqui"
```

## 3. Executar

```bash
npm run dev
```

Acesse: **http://localhost:3000**

## Usar

1. Digite: "Restaurantes em São Paulo"
2. Clique: "Iniciar Análise"
3. Aguarde 15-30 segundos
4. Veja os resultados!

## Ações

- **WhatsApp**: Clique para abrir conversa
- **Email**: Clique para compor email
- **Copiar**: Copie a mensagem pronta

## Problemas?

```bash
# Reinstalar
rm -rf node_modules .next
npm install
npm run dev
```

## Próximos Passos

Leia o [README completo](./README.md) para:
- Customização
- Deploy em produção
- API routes
- Troubleshooting avançado
