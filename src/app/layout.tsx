import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { ThemeProvider } from "@/lib/providers/ThemeProvider";

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
      <body className="bg-gray-50 dark:bg-gray-900">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
