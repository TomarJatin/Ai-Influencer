import type { Metadata } from 'next';
import './globals.css';
import { Urbanist } from 'next/font/google';
import Loading from './loading';
import { Suspense } from 'react';
import Providers from './providers';

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Heizen AI',
  description: 'Heizen AI',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`antialiased ${urbanist.className}`}>
        <Suspense fallback={<Loading />}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
