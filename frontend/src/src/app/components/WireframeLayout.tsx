import { ReactNode } from "react";

type WireframeLayoutProps = {
  title: string;
  children: ReactNode;
};

export function WireframeLayout({ title, children }: WireframeLayoutProps) {
  return (
    <div className="min-h-screen bg-[#2a2a2a] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#3a3a3a] border-2 border-[#1a1a1a] rounded-lg overflow-hidden">
          <div className="bg-[#4a4a4a] px-6 py-4 border-b-2 border-[#1a1a1a]">
            <h1 className="text-white font-bold text-lg tracking-wide">{title}</h1>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
