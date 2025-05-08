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
                {children}</main>
            ) : (
              <>
                <AppHeader />
                <SidebarProvider>
                  <AppSidebar />
                  <main>
                    <SidebarTrigger />
                    {children}
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
