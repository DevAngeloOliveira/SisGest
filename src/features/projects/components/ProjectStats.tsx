import { Project } from '../types/projects.types';
import { motion } from 'framer-motion';

interface ProjectStatsProps {
  project: Project;
}

export function ProjectStats({ project }: ProjectStatsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: project.budget.currency || 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (value: number, threshold: number) => {
    if (value >= threshold) return 'text-green-600 dark:text-green-400';
    if (value >= threshold * 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const calculateDaysRemaining = () => {
    const today = new Date();
    const end = new Date(project.endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <div className="space-y-6">
      {/* Cards de Métricas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Progresso Geral</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {project.progress}%
            </p>
            <p className={`ml-2 text-sm ${getStatusColor(project.progress, project.metrics.plannedProgress)}`}>
              {project.progress >= project.metrics.plannedProgress ? '+' : '-'}
              {Math.abs(project.progress - project.metrics.plannedProgress)}%
            </p>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Orçamento</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {formatCurrency(project.budget.spent)}
            </p>
            <p className={`ml-2 text-sm ${getStatusColor(project.budget.estimated - project.budget.spent, 0)}`}>
              de {formatCurrency(project.budget.estimated)}
            </p>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${(project.budget.spent / project.budget.estimated) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Prazo</h3>
          <div className="mt-2">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {daysRemaining} dias
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(project.startDate)} - {formatDate(project.endDate)}
            </p>
          </div>
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {project.metrics.scheduleVariance >= 0 ? 'No prazo' : 'Atrasado'}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Qualidade</h3>
          <div className="mt-2">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {project.metrics.taskCompletionRate}%
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Taxa de Conclusão
            </p>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className={getStatusColor(project.metrics.taskCompletionRate, 80)}>
                {project.metrics.taskCompletionRate >= 80 ? 'Excelente' : 
                 project.metrics.taskCompletionRate >= 60 ? 'Bom' : 'Precisa Melhorar'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Métricas Detalhadas */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Riscos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Riscos</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Alto</span>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                {project.metrics.riskCount.high}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Médio</span>
              <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                {project.metrics.riskCount.medium}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Baixo</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {project.metrics.riskCount.low}
              </span>
            </div>
          </div>
        </div>

        {/* Utilização da Equipe */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Utilização da Equipe</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500 dark:text-gray-400">Média de Utilização</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {project.metrics.teamUtilization}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    project.metrics.teamUtilization < 50
                      ? 'bg-green-500'
                      : project.metrics.teamUtilization < 80
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${project.metrics.teamUtilization}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 