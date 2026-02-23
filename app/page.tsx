export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-primary-700 mb-4">🐱</h1>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">HANG IN THERE</h2>
        <p className="text-xl text-gray-600 italic mb-8">
          Daily Stories of Grit, Grace & Human Connection
        </p>
        <div className="card">
          <p className="text-lg text-gray-700">
            Welcome to Hang In There! This platform will deliver one curated, verified story each
            day about real people who demonstrated extraordinary grit, tenacity, and hope.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Project initialized successfully. Next.js 14 with TypeScript and Tailwind CSS is ready.
          </p>
        </div>
      </div>
    </main>
  );
}
