import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

export function MainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => {
            const isMobileView = window.innerWidth < 768;
            setIsMobile(isMobileView);
            if (isMobileView) {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header 
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                isSidebarOpen={isSidebarOpen}
            />
            <div className="flex h-screen pt-16">
                <AnimatePresence mode="wait">
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 280, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm z-40"
                        >
                            <Sidebar 
                                isOpen={isSidebarOpen}
                                onClose={() => setIsSidebarOpen(false)}
                                isMobile={isMobile}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                <main 
                    className={`flex-1 transition-all duration-300 overflow-auto h-[calc(100vh-4rem)]`}
                    style={{ 
                        marginLeft: isSidebarOpen ? '280px' : '0',
                        padding: '2rem'
                    }}
                >
                    <motion.div 
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-7xl mx-auto"
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
} 