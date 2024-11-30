import { useState, useEffect } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

export function useResponsive() {
    const [breakpoint, setBreakpoint] = useState<Breakpoint>('xs');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;

            if (width < breakpoints.sm) {
                setBreakpoint('xs');
                setIsMobile(true);
            } else if (width < breakpoints.md) {
                setBreakpoint('sm');
                setIsMobile(true);
            } else if (width < breakpoints.lg) {
                setBreakpoint('md');
                setIsMobile(false);
            } else if (width < breakpoints.xl) {
                setBreakpoint('lg');
                setIsMobile(false);
            } else if (width < breakpoints['2xl']) {
                setBreakpoint('xl');
                setIsMobile(false);
            } else {
                setBreakpoint('2xl');
                setIsMobile(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        breakpoint,
        isMobile,
        isTablet: breakpoint === 'md',
        isDesktop: ['lg', 'xl', '2xl'].includes(breakpoint),
    };
} 