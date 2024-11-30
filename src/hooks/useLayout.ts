import { useState, useEffect } from 'react';

interface LayoutConfig {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isCollapsed: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
    openSidebar: () => void;
}

export function useLayout(): LayoutConfig {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);
            setIsDesktop(width >= 1024);

            // Auto collapse on mobile/tablet
            if (width < 1024) {
                setIsCollapsed(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsCollapsed(prev => !prev);
    const closeSidebar = () => setIsCollapsed(true);
    const openSidebar = () => setIsCollapsed(false);

    return {
        isMobile,
        isTablet,
        isDesktop,
        isCollapsed,
        toggleSidebar,
        closeSidebar,
        openSidebar
    };
} 