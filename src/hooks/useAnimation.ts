import { Variants } from 'framer-motion';

export const useAnimation = () => {
    const fadeIn: Variants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const slideIn: Variants = {
        initial: { x: -20, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 20, opacity: 0 }
    };

    const scaleIn: Variants = {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.9, opacity: 0 }
    };

    const pageTransition: Variants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    const listItem: Variants = {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 }
    };

    return {
        fadeIn,
        slideIn,
        scaleIn,
        pageTransition,
        listItem,
        transition: {
            duration: 0.2,
            ease: 'easeInOut'
        }
    };
}; 