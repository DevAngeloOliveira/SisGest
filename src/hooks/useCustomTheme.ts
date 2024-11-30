import { useState, useEffect } from 'react';
import { lightTheme, darkTheme } from '../styles/theme';

type ThemeMode = 'light' | 'dark';
type ThemeVariant = 'default' | 'green' | 'blue';

export function useCustomTheme() {
    const [mode, setMode] = useState<ThemeMode>('dark');
    const [variant, setVariant] = useState<ThemeVariant>('default');

    useEffect(() => {
        // Detecta preferência do sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setMode(prefersDark ? 'dark' : 'light');

        // Carrega tema salvo
        const savedMode = localStorage.getItem('themeMode') as ThemeMode;
        const savedVariant = localStorage.getItem('themeVariant') as ThemeVariant;

        if (savedMode) setMode(savedMode);
        if (savedVariant) setVariant(savedVariant);
    }, []);

    const toggleMode = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        localStorage.setItem('themeMode', newMode);
        document.documentElement.classList.toggle('dark');
    };

    const setThemeVariant = (newVariant: ThemeVariant) => {
        setVariant(newVariant);
        localStorage.setItem('themeVariant', newVariant);
    };

    const theme = mode === 'light' ? lightTheme : darkTheme;

    return {
        mode,
        variant,
        theme,
        toggleMode,
        setThemeVariant,
        isDark: mode === 'dark',
        isLight: mode === 'light',
    };
} 