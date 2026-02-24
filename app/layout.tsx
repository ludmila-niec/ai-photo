import type { Metadata, Viewport } from "next";
import { Cutive_Mono, Arvo } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

const cutiveMono = Cutive_Mono({
  variable: "--font-cutive-mono",
  subsets: ["latin"],
  weight: ["400"],
});

const arvo = Arvo({
  variable: "--font-arvo",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "RevAIve - AI Photo Restoration",
  description: "Restore and colorize your old photos with AI",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const NoiseTexture = () => {
    return (
      <svg className="hidden">
        <filter id='noiseFilter'>
          <feTurbulence
            type='fractalNoise'
            baseFrequency='0.6'
            stitchTiles='stitch' />
          <feColorMatrix in="colorNoise" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />
          <feComposite operator="in" in2="SourceGraphic" result="monoNoise" />
          <feBlend in="SourceGraphic" in2="monoNoise" mode="screen" />
        </filter>

      </svg>
    );
  };
  return (
    <html lang="en">
      <body className={`${cutiveMono.variable} ${arvo.variable} font-[family-name:var(--font-cutive-mono)] font-[family-name:var(--font-arvo)] antialiased before:content-[''] before:fixed before:inset-0 before:w-full before:h-full before:bg-[#8C8C8C] before:opacity-30 before:filter-[url(#noiseFilter)]`}>
        <NoiseTexture />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
