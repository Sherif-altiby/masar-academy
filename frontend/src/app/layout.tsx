import type { Metadata } from "next";
import "@fontsource/cairo/arabic-400.css";
import "@fontsource/cairo/arabic-500.css";
import "@fontsource/cairo/arabic-600.css";
import "@fontsource/cairo/arabic-700.css";
import "@fontsource/cairo/latin-400.css";
import "@fontsource/cairo/latin-500.css";
import "@fontsource/cairo/latin-600.css";
import "@fontsource/cairo/latin-700.css";
import "@fontsource/tajawal/arabic-500.css";
import "@fontsource/tajawal/arabic-700.css";
import "@fontsource/tajawal/arabic-800.css";
import "@fontsource/tajawal/arabic-900.css";
import "@fontsource/tajawal/latin-500.css";
import "@fontsource/tajawal/latin-700.css";
import "@fontsource/tajawal/latin-800.css";
import "@fontsource/tajawal/latin-900.css";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";

export const metadata: Metadata = {
  title: "أكاديمية مسار — طريق واضح من الدرس إلى الإتقان",
  description:
    "دورات منظمة، مدرّسون حقيقيون، واختبار قصير بعد كل درس.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster position="top-center" />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
