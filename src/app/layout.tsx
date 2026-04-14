import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
