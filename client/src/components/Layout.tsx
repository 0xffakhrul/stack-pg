import { Header } from "./Header";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 ">
        {children}
      </main>
    </div>
  );
}
