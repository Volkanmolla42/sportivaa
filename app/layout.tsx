import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { ReactQueryProvider } from "@/lib/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "Sportiva | Dijital Spor Platformu",
  description:
    "Spor salonları, eğitmenler ve üyeler için dijital platform. Rezervasyon, takip, analiz ve daha fazlası.",
  keywords: [
    "spor",
    "salon",
    "fitness",
    "egzersiz",
    "dijital platform",
    "rezervasyon",
    "analiz",
    "üyelik",
    "eğitmen",
    "yeni nesil spor",
  ],
  authors: [{ name: "Sportiva", url: "https://sportiva.com" }],
  creator: "Sportiva",
  openGraph: {
    title: "Sportiva | Dijital Spor Platformu",
    description:
      "Spor salonları, eğitmenler ve üyeler için dijital platform. Rezervasyon, takip, analiz ve daha fazlası.",
    url: "https://sportiva.com",
    siteName: "Sportiva",
    images: [
      {
        url: "/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "Sportiva Logo",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sportiva | Dijital Spor Platformu",
    description: "Spor salonları, eğitmenler ve üyeler için dijital platform.",
    site: "@sportiva",
    creator: "@sportiva",
    images: ["/icon-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ReactQueryProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
