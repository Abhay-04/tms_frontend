"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { Provider } from "react-redux";
import { store, persistor } from "@/lib/store";
import { PersistGate } from "redux-persist/integration/react";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname === "/login" || pathname === "/";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {hideLayout ? (
              <main>
                <AppHeader />
                {children}
                <Toaster richColors position="top-right" />
                </main>
            ) : (
              <>
                <AppHeader />
                <SidebarProvider>
                  <AppSidebar />
                  <main>
                    <SidebarTrigger />
                    {children}
                    <Toaster richColors position="top-right" />
                  </main>
                </SidebarProvider>
              </>
            )}
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
