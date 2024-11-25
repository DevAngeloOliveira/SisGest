import { useState, useEffect } from 'react';
import { Project, ProjectMetrics, ProjectRisk } from '../types/project.types';

interface ProjectDashboardProps {
  project: Project;
}

export function ProjectDashboard({ project }: ProjectDashboardProps) {
  const [currentMetrics, setCurrentMetrics] = useState<ProjectMetrics>(project.metrics);
  const [currentRisks, setCurrentRisks] = useState<ProjectRisk[]>(
    project.risks?.filter(risk => risk.status === 'IDENTIFIED') || []
  );

  useEffect(() => {
    setCurrentMetrics(project.metrics);
    setCurrentRisks(project.risks?.filter(risk => risk.status === 'IDENTIFIED') || []);
  }, [project]);

  return (
    <div className="space-y-6">
      {/* Métricas do Projeto */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Progresso Geral
          </h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {currentMetrics.actualProgress}%
          </p>
        </div>
      </div>

      {/* Riscos Ativos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Riscos Ativos ({currentRisks.length})
        </h3>
        <div className="space-y-4">
          {currentRisks.map(risk => (
            <div key={risk.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {risk.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Impacto: {risk.impact} | Probabilidade: {risk.probability}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 