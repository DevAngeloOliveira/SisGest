import { Project, ProjectMilestone } from '../types/projects.types';
import { motion } from 'framer-motion';

interface ProjectTimelineProps {
  project: Project;
}

export function ProjectTimeline({ project }: ProjectTimelineProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateProgress = (phase: { startDate: Date; endDate: Date }) => {
    const today = new Date();
    const start = new Date(phase.startDate);
    const end = new Date(phase.endDate);
    const total = end.getTime() - start.getTime();
    const current = today.getTime() - start.getTime();
    
    if (today < start) return 0;
    if (today > end) return 100;
    return Math.round((current / total) * 100);
  };

  const getStatusColor = (progress: number, plannedProgress: number) => {
    if (progress >= plannedProgress) return 'bg-green-500';
    if (progress >= plannedProgress * 0.7) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMilestoneStatusColor = (status: 'PENDING' | 'COMPLETED') => {
    return status === 'COMPLETED' 
      ? 'bg-green-500 ring-green-200' 
      : 'bg-gray-300 ring-gray-100 dark:bg-gray-600 dark:ring-gray-500';
  };

  return (
    <div className="space-y-8">
      {/* Visão Geral do Cronograma */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Cronograma do Projeto
        </h2>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span>Início: {formatDate(project.startDate)}</span>
          <span>Término: {formatDate(project.endDate)}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Fases do Projeto */}
      <div className="space-y-6">
        {project.timeline.phases.map((phase, index) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {phase.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                  </p>
                </div>
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {phase.progress}% Concluído
                </span>
              </div>

              {/* Barra de Progresso da Fase */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Progresso</span>
                  <span>{phase.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      getStatusColor(phase.progress, calculateProgress(phase))
                    }`}
                    style={{ width: `${phase.progress}%` }}
                  />
                </div>
              </div>

              {/* Marcos da Fase */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Marcos
                </h4>
                <div className="relative">
                  {/* Linha do Tempo */}
                  <div className="absolute top-0 left-5 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />

                  {/* Marcos */}
                  <div className="space-y-8">
                    {phase.milestones.map((milestone: ProjectMilestone, idx) => (
                      <div key={milestone.id} className="relative flex items-start">
                        <div className={`absolute left-0 w-10 h-10 rounded-full ring-4 ${
                          getMilestoneStatusColor(milestone.status)
                        } flex items-center justify-center`}>
                          <span className="text-white font-medium">
                            {idx + 1}
                          </span>
                        </div>
                        <div className="ml-16">
                          <h4 className="text-base font-medium text-gray-900 dark:text-white">
                            {milestone.title}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {milestone.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {milestone.deliverables.map((deliverable, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              >
                                {deliverable}
                              </span>
                            ))}
                          </div>
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Prazo: {formatDate(milestone.dueDate)}
                          </p>
                          {milestone.dependencies && milestone.dependencies.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Dependências:
                              </p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {milestone.dependencies.map((depId) => {
                                  const dep = phase.milestones.find(m => m.id === depId);
                                  return dep ? (
                                    <span
                                      key={depId}
                                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                    >
                                      {dep.title}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 