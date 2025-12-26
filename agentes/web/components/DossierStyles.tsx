'use client'

export function DossierStyles() {
  return (
    <style jsx global>{`
      /* Destaque para valores monetários R$ */
      .markdown-dossier :is(p, li, strong, div):has-text("R$") {
        font-weight: 600;
      }

      /* Cores para status */
      .markdown-dossier li {
        position: relative;
        padding-left: 0.5rem;
      }

      /* ✅ - Verde */
      .markdown-dossier li:has-text("✅") {
        border-left: 3px solid hsl(142, 76%, 36%);
        padding-left: 1rem;
        background: hsl(142, 76%, 96%);
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
        margin-bottom: 0.5rem;
        border-radius: 0.25rem;
      }

      /* ❌ - Vermelho */
      .markdown-dossier li:has-text("❌") {
        border-left: 3px solid hsl(0, 84%, 60%);
        padding-left: 1rem;
        background: hsl(0, 84%, 96%);
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
        margin-bottom: 0.5rem;
        border-radius: 0.25rem;
      }

      /* Destaque para números de telefone */
      .markdown-dossier code:has-text("(") {
        background: hsl(var(--primary) / 0.1);
        color: hsl(var(--primary));
        font-weight: 600;
      }

      /* Destaque para seções de dinheiro */
      .markdown-dossier h2:has-text("💰"),
      .markdown-dossier h2:has-text("Receita"),
      .markdown-dossier h2:has-text("Impacto") {
        color: hsl(0, 84%, 60%);
        border-color: hsl(0, 84%, 60%);
      }

      /* Destaque para valores grandes */
      .markdown-dossier strong:has-text("R$") {
        font-size: 1.1em;
        color: hsl(0, 84%, 60%);
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      /* Blocos de código com gradiente mais bonito */
      .markdown-dossier pre {
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }

      /* Animação suave para elementos */
      .markdown-dossier h2,
      .markdown-dossier h3,
      .markdown-dossier p,
      .markdown-dossier ul,
      .markdown-dossier pre {
        animation: slideIn 0.4s ease-out;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(-10px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      /* Hover em links */
      .markdown-dossier a {
        position: relative;
        transition: all 0.2s ease;
      }

      .markdown-dossier a:hover {
        transform: translateY(-1px);
      }

      /* Bullets customizados */
      .markdown-dossier ul {
        list-style: none;
        padding-left: 0;
      }

      .markdown-dossier ul li {
        padding-left: 1.5rem;
        position: relative;
      }

      .markdown-dossier ul li::before {
        content: "▸";
        position: absolute;
        left: 0;
        color: hsl(var(--primary));
        font-weight: bold;
      }

      /* Números de listas ordenadas com estilo */
      .markdown-dossier ol {
        counter-reset: item;
        list-style: none;
        padding-left: 0;
      }

      .markdown-dossier ol li {
        counter-increment: item;
        padding-left: 2rem;
        position: relative;
      }

      .markdown-dossier ol li::before {
        content: counter(item);
        position: absolute;
        left: 0;
        background: hsl(var(--primary));
        color: white;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: bold;
      }

      /* Seções com background diferenciado */
      .markdown-dossier h2:has-text("📱") + * {
        background: hsl(var(--primary) / 0.05);
        padding: 1rem;
        border-radius: 0.5rem;
        margin-top: 1rem;
      }

      /* Print-friendly */
      @media print {
        .markdown-dossier {
          color: black;
        }

        .markdown-dossier pre {
          background: #f5f5f5;
          color: black;
          border: 1px solid #ddd;
        }
      }
    `}</style>
  )
}
