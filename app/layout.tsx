import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vocational Agentic Early Warning System (EWS)',
  description: 'Dashboard intelijen analitik pemantauan pelatihan vokasi dengan zero-math accuracy, deteksi risiko peserta, dan AI chat pendampingan koordinator.',
  openGraph: {
    title: 'Vocational Agentic Early Warning System (EWS)',
    description: 'Dashboard intelijen analitik pemantauan pelatihan vokasi dengan zero-math accuracy, deteksi risiko peserta, dan AI chat pendampingan koordinator.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vocational Agentic Early Warning System (EWS)',
    description: 'Dashboard intelijen analitik pemantauan pelatihan vokasi dengan zero-math accuracy, deteksi risiko peserta, dan AI chat pendampingan koordinator.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans selection:bg-indigo-500 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
