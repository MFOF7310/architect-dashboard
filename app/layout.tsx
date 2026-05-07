import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ARCHITECT CG-223 | Dashboard',
  description: 'Neural Grid Control Panel - BAMAKO_223',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0a0a0a', color: '#fff', fontFamily: 'monospace' }}>
        {children}
      </body>
    </html>
  );
}
