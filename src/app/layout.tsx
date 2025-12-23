import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "./ThemeScript";

export const metadata: Metadata = {
  title: "Movie & Show Picker",
  description:
    "A multi-agent AI system that recommends movies & shows based on natural language requests",
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
        {children}
      </body>
    </html>
  );
}
