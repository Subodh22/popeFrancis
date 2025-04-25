import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { ThemeProvider } from "@/lib/providers/ThemeProvider";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Pope Francis Conversational AI",
  description: "Engage in meaningful dialogue with a simulation of Pope Francis through AI technology.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-900 flex flex-col min-h-screen">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <main className="flex-1">
              {children}
            </main>
            
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
