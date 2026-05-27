import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Charló AI | Asistente de WhatsApp con IA para Negocios en Colombia',
  description:
    'Automatiza la atención al cliente de tu restaurante, clínica o negocio local en Colombia con IA. Responde mensajes de WhatsApp 24/7, agenda citas y gestiona reservas sin código.',
  keywords: [
    'asistente whatsapp ia',
    'bot whatsapp colombia',
    'automatización negocios locales',
    'chatbot restaurante',
    'chatbot clínica',
    'atención al cliente ia',
    'whatsapp business api colombia',
  ],
  authors: [{ name: 'Charló AI' }],
  creator: 'Charló AI',
  metadataBase: new URL('https://www.charloai.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://www.charloai.com',
    siteName: 'Charló AI',
    title: 'Charló AI | Asistente de WhatsApp con IA para Negocios en Colombia',
    description:
      'Automatiza la atención al cliente de tu restaurante, clínica o negocio local. Responde WhatsApp 24/7, configúralo en 5 minutos sin código.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Charló AI — Asistente de WhatsApp con IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Charló AI | Asistente de WhatsApp con IA',
    description:
      'Automatiza la atención al cliente de tu negocio en Colombia. Responde WhatsApp 24/7 sin código.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'facebook-domain-verification': 'mz5vpk0lvm5cqthagw6o8k5xwsgnn9',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3WCGE2MVTM"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3WCGE2MVTM');
          `}
        </Script>
      </body>
    </html>
  )
}
