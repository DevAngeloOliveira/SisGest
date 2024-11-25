import { TimelinePhase } from '../types/timeline.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProjectTimelineProps {
  phases: TimelinePhase[];
}

export function ProjectTimeline({ phases }: ProjectTimelineProps) {
  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  };

  return (
    <div className="space-y-8">
      {phases.map((phase) => (
        <div key={phase.id} className="relative">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-medium">{phase.progress}%</span>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {phase.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
              </p>
            </div>
          </div>
          <div className="mt-2 ml-14">
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${phase.progress}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 