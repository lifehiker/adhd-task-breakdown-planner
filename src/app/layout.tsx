import type { Metadata } from "next";
import { Cormorant_Garamond, Fraunces } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const bodyFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "FocusSteps — ADHD Task Breakdown Planner",
  description:
    "Stop staring at overwhelming to-do lists. FocusSteps breaks tasks into tiny timed steps and helps ADHD users start, continue, and finish without heavy planning.",
  keywords: [
    "adhd planner",
    "adhd task breakdown",
    "break tasks into steps adhd",
    "adhd focus timer",
    "adhd executive function app",
    "task paralysis",
  ],
  openGraph: {
    title: "FocusSteps — ADHD Task Breakdown Planner",
    description: "Break one overwhelming task into tiny timed steps. No setup. Just start.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} app-shell`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
