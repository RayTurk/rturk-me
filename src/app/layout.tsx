import type { Metadata } from 'next';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CommandPalette from '@/components/interactive/CommandPalette';
import { JsonLd } from '@/components/seo/JsonLd';
import { generatePersonSchema, generateWebSiteSchema } from '@/lib/schema';

const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });
const clash = localFont({
  src: [
    { path: '../../public/fonts/clash-display-600.woff2', weight: '600' },
    { path: '../../public/fonts/clash-display-700.woff2', weight: '700' },
  ],
  variable: '--font-clash',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rturk.me'),
  title: { default: 'Ray Turk — Full-Stack Developer', template: '%s · Ray Turk' },
  description:
    'Cleveland-based full-stack developer building fast, headless, animated web experiences.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrains.variable} ${clash.variable}`}>
      <body className="font-sans antialiased">
        <JsonLd data={[generatePersonSchema(), generateWebSiteSchema()]} />
        <CommandPalette />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
