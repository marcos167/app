import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { GamificationProvider } from "@/contexts/GamificationContext";
import { ModerationProvider } from "@/contexts/ModerationContext";
import { AchievementToastProvider } from "@/components/gamification/AchievementToast";
import { GoogleOAuthProvider } from '@react-oauth/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chefex - Seu Assistente na Cozinha",
  description: "Chefex - Receitas inteligentes e personalizadas. Um produto Axis Software.",
  manifest: "/manifest.json",
  themeColor: "#0c0a09",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Chefex",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // App-like feel
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1019372792734-k6s58dq78pov4ktnhoiv9ddf3mkbjrf3.apps.googleusercontent.com'}>
          <ThemeProvider>
            <SubscriptionProvider>
              <GamificationProvider>
                <ModerationProvider>
                  <AchievementToastProvider>
                    <ToastProvider>
                      {children}
                    </ToastProvider>
                  </AchievementToastProvider>
                </ModerationProvider>
              </GamificationProvider>
            </SubscriptionProvider>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
