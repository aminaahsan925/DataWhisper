import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DataWhisper — AI-Powered Data Analyst",
  description: "Upload your CSV or Excel file, ask questions in plain English, and get instant charts, deep insights, and downloadable reports — all powered by AI.",
  keywords: ["data analysis", "AI", "CSV", "Excel", "charts", "Gemini AI"],
  authors: [{ name: "Amina Ahsan" }],
  openGraph: {
    title: "DataWhisper — AI-Powered Data Analyst",
    description: "Upload CSV, ask questions, get insights — powered by Gemini AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ margin: 0, padding: 0, background: "#09090B" }}>
        {children}
      </body>
    </html>
  );
}

