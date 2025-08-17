'use client';
import { ThemeProvider } from '@/components/theme-providers';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SessionProvider } from 'next-auth/react';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ThemeProvider attribute='class' defaultTheme='system' disableTransitionOnChange>
        <Toaster duration={2500} richColors closeButton position='top-right' />
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default Providers;
