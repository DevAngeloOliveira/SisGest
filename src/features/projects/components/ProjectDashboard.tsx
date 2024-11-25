import { useState, useEffect } from 'react';
import { Project, ProjectMetrics, ProjectRisk } from '../types/projects.types';
import { motion } from 'framer-motion';

interface ProjectDashboardProps {
  project: Project;
}

export function ProjectDashboard({ project }: ProjectDashboardProps) {
  const [metrics, setMetrics] = useState<ProjectMetrics>(project.metrics);
  const [activeRisks, setActiveRisks] = useState<ProjectRisk[]>(
    project.risks?.filter(risk => risk.status === 'IDENTIFIED') || []
  );

  useEffect(() => {
    setMetrics(project.metrics || {
      plannedProgress: 0,
      actualProgress: 0,
      costVariance: 0,
      scheduleVariance: 0,
      taskCompletionRate: 0,
      teamUtilization: 0,
      riskCount: { high: 0, medium: 0, low: 0 }
    });
    setActiveRisks(project.risks?.filter(risk => risk.status === 'IDENTIFIED') || []);
  }, [project]);

  const getStatusColor = (value: number, threshold: number) => {
    if (value >= threshold) return 'text-green-600 dark:text-green-400';
    if (value >= threshold * 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Visão Geral */}
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
            <p className={`ml-2 text-sm ${getStatusColor(project.progress, 70)}`}>
              {project.progress >= metrics.plannedProgress ? '+' : '-'}
              {Math.abs(project.progress - metrics.plannedProgress)}%
            </p>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
              <div
                className="h-full bg-blue-600 rounded-full"
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
                className="h-full bg-blue-600 rounded-full"
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
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Equipe</h3>
          <div className="mt-2">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {project.team.length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {metrics.teamUtilization}% utilização
            </p>
          </div>
          <div className="mt-4 flex -space-x-2">
            {project.team.slice(0, 5).map(member => (
              <div
                key={member.id}
                className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800 flex items-center justify-center"
              >
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-full w-full rounded-full"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            ))}
            {project.team.length > 5 && (
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  +{project.team.length - 5}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Riscos Ativos</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {activeRisks.length}
          </p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-600 dark:text-red-400">Alto: {metrics.riskCount.high}</span>
              <span className="text-yellow-600 dark:text-yellow-400">Médio: {metrics.riskCount.medium}</span>
              <span className="text-green-600 dark:text-green-400">Baixo: {metrics.riskCount.low}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Próximos Marcos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Próximos Marcos</h3>
          <div className="mt-4 space-y-4">
            {project.milestones
              .filter(milestone => milestone.status === 'PENDING')
              .slice(0, 3)
              .map(milestone => (
                <div
                  key={milestone.id}
                  className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{milestone.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{milestone.description}</p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(milestone.dueDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Riscos Ativos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Riscos Ativos</h3>
          <div className="mt-4 space-y-4">
            {activeRisks.slice(0, 3).map(risk => (
              <div
                key={risk.id}
                className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{risk.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Impacto: {risk.impact.toLowerCase()} | Probabilidade: {risk.probability.toLowerCase()}
                  </p>
                </div>
                <div className="text-sm">
                  <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    Ver Plano
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Qualidade */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Métricas de Qualidade</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {project.qualityMetrics.map((metric, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 dark:border-gray-700"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white">{metric.criteria}</p>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {metric.actual}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    / {metric.target}
                  </span>
                </div>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    metric.status === 'ON_TRACK'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : metric.status === 'AT_RISK'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {metric.status === 'ON_TRACK' ? 'No Alvo' : metric.status === 'AT_RISK' ? 'Em Risco' : 'Fora do Alvo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 