import { Project, TeamMember } from '../types/projects.types';
import { motion } from 'framer-motion';

interface ProjectTeamProps {
  project: Project;
  showAll?: boolean;
  onMemberClick?: (member: TeamMember) => void;
}

export function ProjectTeam({ project, showAll = false, onMemberClick }: ProjectTeamProps) {
  const teamToShow = showAll ? project.team : project.team.slice(0, 3);

  const getMemberWorkloadColor = (workload?: number) => {
    if (!workload) return 'bg-gray-200 dark:bg-gray-700';
    if (workload < 50) return 'bg-green-200 dark:bg-green-700';
    if (workload < 80) return 'bg-yellow-200 dark:bg-yellow-700';
    return 'bg-red-200 dark:bg-red-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Equipe do Projeto ({project.team.length} membros)
        </h2>
        {!showAll && project.team.length > 3 && (
          <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
            Ver todos
          </button>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {teamToShow.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onMemberClick?.(member)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-medium text-white">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-gray-800 ${getMemberWorkloadColor(member.workload)}`} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Skills */}
              {member.skills && member.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Métricas */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tarefas</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {member.assignedTasks || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Disponibilidade</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {member.availability || 0}h/sem
                  </p>
                </div>
              </div>

              {/* Carga de Trabalho */}
              {member.workload !== undefined && (
                <div>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Carga de Trabalho</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {member.workload}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        member.workload < 50
                          ? 'bg-green-500'
                          : member.workload < 80
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${member.workload}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 