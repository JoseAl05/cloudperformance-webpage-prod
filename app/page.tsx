import { SidebarComponent } from '@/components/Sidebar';
import Image from "next/image";

export default function Home() {
  return (
      <div className="min-h-screen bg-gray-50 flex">
      <SidebarComponent />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
          <p className="text-gray-600">Main content area - sidebar is now responsive and collapsible!</p>
        </div>
      </main>
    </div>
  );
}
