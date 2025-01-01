"use client";

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-bg-800 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-foreground">AIOM</h2>
        <p className="text-neutral-400 mt-2">Ładowanie...</p>
      </div>
    </div>
  );
};
