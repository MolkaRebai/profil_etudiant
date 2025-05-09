import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppLogo } from '@/components/layout/app-logo';
import { MainNavigation } from '@/components/layout/main-nav';
import { UserNav } from '@/components/layout/user-nav'; // Placeholder for user actions
import { ThemeToggle } from '@/components/layout/theme-toggle'; // Placeholder for theme toggle

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Étudiant Bien-Être',
  description: 'Plateforme de soutien au bien-être étudiant',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider defaultOpen={true}>
          <Sidebar collapsible="icon">
            <SidebarHeader className="flex items-center justify-between p-3">
              <AppLogo />
              <div className="md:hidden">
                <SidebarTrigger />
              </div>
            </SidebarHeader>
            <SidebarContent>
              <MainNavigation />
            </SidebarContent>
            <SidebarFooter className="p-3 flex items-center justify-between">
              {/* <ThemeToggle /> */}
              <div className="hidden md:block">
                 <SidebarTrigger />
              </div>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 justify-end">
              <UserNav />
            </header>
            <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
          </SidebarInset>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
