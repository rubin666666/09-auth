import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { AuthProvider } from "@/components/AuthProvider/AuthProvider";
import { TanStackProvider } from "@/components/TanStackProvider/TanStackProvider";

export const metadata: Metadata = {
  title: {
    default: "NoteHub Auth",
    template: "%s | NoteHub Auth",
  },
  description:
    "A Next.js NoteHub app with protected routes and cookie-based auth.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
  modal: ReactNode;
}>;

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <AuthProvider>
            <div className="app-shell">
              <Header />
              {children}
              {modal}
              <Footer />
            </div>
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
