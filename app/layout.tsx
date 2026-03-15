import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "./globals.css";
import { getConfiguracion } from '@/lib/airtable';

export const metadata: Metadata = {
  title: "El Mesón del Molino",
  description: "Restaurante y Eventos",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getConfiguracion();
  const primario = config?.color_primario || 'var(--color-primario)';
  const secundario = config?.color_secundario || 'var(--color-secundario)';
  const acento = config?.color_acento || 'var(--color-acento)';

  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <style>{`
          :root {
            --color-primario: ${primario};
            --color-secundario: ${secundario};
            --color-acento: ${acento};
          }
        `}</style>
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
