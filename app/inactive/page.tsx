export default function Inactive() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-500 mb-2">AIOM</h1>
          <p className="text-neutral-400">All-in-one Manager</p>
        </div>
        <div className="bg-bg-800 p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Konto nieaktywne
          </h2>
          <p className="text-neutral-400">
            Twoje konto jest obecnie nieaktywne. Skontaktuj się z
            administratorem w celu uzyskania pomocy.
          </p>
        </div>
      </div>
    </main>
  );
}
