import { TeamMember } from '../types/project.types';

interface ProjectTeamProps {
  team: TeamMember[];
}

export function ProjectTeam({ team }: ProjectTeamProps) {
  const getMemberWorkloadColor = (workload: number) => {
    if (!workload) return 'bg-gray-400';
    if (workload < 50) return 'bg-green-400';
    if (workload < 80) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const extendedTeam = team.map(member => ({
    ...member,
    workload: 0,
    skills: [],
    assignedTasks: 0,
    availability: 0
  }));

  return (
    <div className="space-y-6">
      {extendedTeam.map((member) => (
        <div key={member.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-gray-800 ${getMemberWorkloadColor(member.workload)}`} />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {member.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {member.role}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Skills */}
            {member.skills && member.skills.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Habilidades</h4>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Métricas */}
            <div className="space-y-2">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Tarefas Atribuídas</h4>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {member.assignedTasks || 0}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Disponibilidade</h4>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {member.availability || 0}h/sem
                </p>
              </div>

              {/* Carga de Trabalho */}
              {member.workload !== undefined && (
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Carga de Trabalho
                    </h4>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.workload}%
                    </span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                    <div
                      className={`h-full rounded-full ${
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
          </div>
        </div>
      ))}
    </div>
  );
} 