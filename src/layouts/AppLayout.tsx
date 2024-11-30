import { ReactNode, useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={toggleSidebar}
          isMobile={false}
        />
        <Sidebar
          isOpen={isMobileSidebarOpen}
          onClose={toggleMobileSidebar}
          isMobile={true}
        />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
} 