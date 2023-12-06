"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/context/authContext";

const inter = Inter({ subsets: ["latin"] });

import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <body className={inter.className}> {children}</body>
        </AuthContextProvider>
      </QueryClientProvider>
    </html>
  );
}
