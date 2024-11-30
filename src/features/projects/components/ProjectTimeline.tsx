import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Project } from '../types/project.types';

interface ProjectTimelineProps {
  project: Project;
}

export function ProjectTimeline({ project }: ProjectTimelineProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Timeline do Projeto
      </h3>
      
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
        
        <div className="space-y-6">
          {/* Início do Projeto */}
          <div className="relative flex items-center">
            <div className="absolute left-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-12">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Início do Projeto
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(project.startDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>

          {/* Data Final */}
          <div className="relative flex items-center">
            <div className="absolute left-0 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-12">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Prazo Final
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(project.endDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 