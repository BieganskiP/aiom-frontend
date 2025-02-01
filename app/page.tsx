import { LoginForm } from "@/components/molecules/forms/LoginForm";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md flex flex-col gap-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-500 mb-2">AIOM</h1>
          <p className="text-neutral-400">All-in-one Manager</p>
        </div>
        <div className="bg-bg-800 p-8 rounded-lg shadow-lg">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
