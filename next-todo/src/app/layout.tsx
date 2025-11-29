import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "@/contexts/auth-context";
import { AppShell } from "@/components/app-shell";
import { TaskManagerProvider } from "@/hooks/use-task-manager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Planora",
  description:
    "Plan rich tasks, track focus sessions, and gain insights across every device.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#020617] text-white antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <TaskManagerProvider>
              <AppShell>{children}</AppShell>
            </TaskManagerProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
