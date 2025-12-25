#!/usr/bin/env bun

/**
 * Script de validação de configuração
 * Verifica se o ambiente está configurado corretamente
 */

import { getConfig, validateConfig } from "./config";
import * as fs from "fs";
import * as path from "path";

console.log("🔍 Validando Configuração do Sniper Agent\n");
console.log("=".repeat(60));

let hasErrors = false;

// --- 1. Verificar arquivos essenciais ---
console.log("\n📁 Verificando arquivos essenciais...");

const requiredFiles = [
  "agent.ts",
  "config.ts",
  "types.ts",
  "search.service.ts",
  "nodes.ts",
  "package.json",
  ".env.example",
];

for (const file of requiredFiles) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - FALTANDO`);
    hasErrors = true;
  }
}

// --- 2. Verificar .env ---
console.log("\n🔐 Verificando arquivo .env...");

const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  console.log("   ✅ Arquivo .env existe");

  // Tentar validar configuração
  if (validateConfig()) {
    console.log("   ✅ Configuração válida");
    try {
      const config = getConfig();
      console.log(`   ℹ️  Modelo: ${config.modelName}`);
      console.log(`   ℹ️  Temperatura: ${config.temperature}`);
      console.log(
        `   ℹ️  SERPER_API_KEY: ${config.serperApiKey.substring(0, 8)}...`
      );
      console.log(
        `   ℹ️  GOOGLE_API_KEY: ${config.googleApiKey.substring(0, 8)}...`
      );
    } catch (error) {
      console.log(
        `   ⚠️  Erro ao carregar config: ${
          error instanceof Error ? error.message : "Desconhecido"
        }`
      );
    }
  } else {
    console.log("   ❌ Configuração inválida");
    console.log(
      "   ℹ️  Verifique se GOOGLE_API_KEY e SERPER_API_KEY estão definidas"
    );
    hasErrors = true;
  }
} else {
  console.log("   ❌ Arquivo .env não encontrado");
  console.log("   ℹ️  Execute: cp .env.example .env");
  hasErrors = true;
}

// --- 3. Verificar dependências ---
console.log("\n📦 Verificando dependências...");

try {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8")
  );

  const requiredDeps = [
    "@langchain/core",
    "@langchain/google-genai",
    "@langchain/langgraph",
    "dotenv",
    "zod",
  ];

  for (const dep of requiredDeps) {
    if (packageJson.dependencies[dep]) {
      console.log(`   ✅ ${dep} - ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`   ❌ ${dep} - FALTANDO`);
      hasErrors = true;
    }
  }
} catch (error) {
  console.log(
    `   ❌ Erro ao ler package.json: ${
      error instanceof Error ? error.message : "Desconhecido"
    }`
  );
  hasErrors = true;
}

// --- 4. Verificar node_modules ---
console.log("\n📚 Verificando instalação de módulos...");

const nodeModulesPath = path.join(process.cwd(), "node_modules");
if (fs.existsSync(nodeModulesPath)) {
  console.log("   ✅ node_modules existe");
} else {
  console.log("   ❌ node_modules não encontrado");
  console.log("   ℹ️  Execute: bun install");
  hasErrors = true;
}

// --- 5. Verificar TypeScript ---
console.log("\n🔧 Verificando TypeScript...");

try {
  const tsconfig = path.join(process.cwd(), "tsconfig.json");
  if (fs.existsSync(tsconfig)) {
    console.log("   ✅ tsconfig.json existe");
  } else {
    console.log("   ⚠️  tsconfig.json não encontrado (opcional)");
  }
} catch (error) {
  console.log("   ⚠️  Não foi possível verificar TypeScript");
}

// --- Resultado Final ---
console.log("\n" + "=".repeat(60));

if (hasErrors) {
  console.log("❌ VALIDAÇÃO FALHOU - Corrija os erros acima");
  console.log("=".repeat(60));
  process.exit(1);
} else {
  console.log("✅ VALIDAÇÃO COMPLETA - Sistema pronto para uso!");
  console.log("=".repeat(60));
  console.log("\n💡 Para executar o agente:");
  console.log('   bun run agent.ts "Restaurantes em São Paulo"');
  console.log("\n📖 Para mais informações, consulte o README.md\n");
  process.exit(0);
}
