import { motion } from 'framer-motion';
import { useCustomTheme } from '../../hooks/useCustomTheme';

export function ThemeCustomizer() {
  const { mode, variant, toggleMode, setThemeVariant } = useCustomTheme();

  const variants = [
    { id: 'default', name: 'Padrão', color: '#22c55e' },
    { id: 'green', name: 'Verde', color: '#10b981' },
    { id: 'blue', name: 'Azul', color: '#3b82f6' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50"
    >
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Modo
          </h4>
          <button
            onClick={toggleMode}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-900 dark:text-white"
          >
            {mode === 'light' ? 'Modo Escuro' : 'Modo Claro'}
          </button>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Tema
          </h4>
          <div className="flex space-x-2">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setThemeVariant(v.id as any)}
                className={`w-8 h-8 rounded-full ${
                  variant === v.id ? 'ring-2 ring-offset-2 ring-primary-500' : ''
                }`}
                style={{ backgroundColor: v.color }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 