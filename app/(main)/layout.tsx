import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <main className="flex-grow">{children}</main>
    </div>
  );
}