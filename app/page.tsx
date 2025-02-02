import { LoginForm } from "@/components/molecules/forms/LoginForm";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md flex flex-col gap-8 relative z-10">
        {/* Logo and branding section */}
        <div className="text-center space-y-4">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg mb-4">
              <h1 className="text-3xl font-['Audiowide'] text-white">A</h1>
            </div>
            <h1 className="text-4xl font-['Audiowide'] text-primary-500">
              AIOM
            </h1>
          </div>
          <div className="space-y-2">
            <p className="text-neutral-400 text-lg">
              System Zarządzania Dostawami
            </p>
            <p className="text-neutral-500 text-sm max-w-sm mx-auto">
              Efektywne zarządzanie dostawami cateringu w różnych regionach
              miasta
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-neutral-400 mt-2">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Strefy dostaw</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Rozliczenia</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>Zarządzanie kierowcami</span>
              </div>
            </div>
          </div>
        </div>

        {/* Login form card */}
        <div className="bg-bg-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-bg-700">
          <LoginForm />
        </div>

        {/* Footer */}
        <div className="text-center text-neutral-500 text-sm">
          <p>© {new Date().getFullYear()} AIOM. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </main>
  );
}
