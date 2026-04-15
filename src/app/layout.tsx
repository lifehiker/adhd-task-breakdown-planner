import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
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
      <body className={`${jakarta.variable} ${dmSerif.variable} font-sans`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
