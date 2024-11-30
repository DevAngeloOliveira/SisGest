export const animations = {
    transitions: {
        fast: '150ms ease-in-out',
        normal: '300ms ease-in-out',
        slow: '500ms ease-in-out',
    },
    keyframes: {
        fadeIn: {
            from: { opacity: 0 },
            to: { opacity: 1 },
        },
        slideIn: {
            from: { transform: 'translateY(20px)', opacity: 0 },
            to: { transform: 'translateY(0)', opacity: 1 },
        },
        pulse: {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.5 },
        },
    },
    variants: {
        fadeIn: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        },
        slideIn: {
            initial: { y: 20, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            exit: { y: -20, opacity: 0 },
        },
    },
}; 