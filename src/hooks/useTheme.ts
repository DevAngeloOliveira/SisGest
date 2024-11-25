import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  const applyTheme = useCallback((newTheme: Theme) => {
    const root = window.document.documentElement;
    
    // Inicia a transição
    setIsTransitioning(true);
    
    // Adiciona overlay para evitar flash
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    document.body.appendChild(overlay);
    
    // Força um reflow
    overlay.offsetHeight;
    overlay.classList.add('active');

    // Desabilita transições durante a mudança
    root.classList.add('disable-transitions');
    
    // Aplica o novo tema
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
    
    // Atualiza a meta tag de cor do tema
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        newTheme === 'dark' ? '#1a1b1e' : '#ffffff'
      );
    }

    // Reativa as transições após um pequeno delay
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove('disable-transitions');
        overlay.classList.remove('active');
        
        // Remove o overlay após a transição
        setTimeout(() => {
          overlay.remove();
          setIsTransitioning(false);
        }, 150);
      });
    });

    localStorage.setItem('theme', newTheme);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (!localStorage.getItem('theme')) {
        setTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    if (!isTransitioning) {
      setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    }
  }, [isTransitioning]);

  return { theme, toggleTheme, isTransitioning };
} 