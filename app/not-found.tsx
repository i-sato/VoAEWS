import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-white font-mono">404</h2>
        <p className="text-base text-slate-300">
          Halaman tidak ditemukan pada sistem Vocational EWS.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition shadow-md"
          >
            Kembali ke Dashboard Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
