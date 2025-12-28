import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "./ThemeScript";
import { ApiKeyProvider } from "@/contexts/ApiKeyContext";

export const metadata: Metadata = {
  title: "StreamWise AI | Intelligent Entertainment Curator",
  description:
    "An autonomous multi-agent system that interprets natural language to discover the perfect movies and TV shows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-[#202020] transition-all duration-300 ease-in-out">
        <ThemeToggle />
        <ApiKeyProvider>{children}</ApiKeyProvider>
      </body>
    </html>
  );
}
