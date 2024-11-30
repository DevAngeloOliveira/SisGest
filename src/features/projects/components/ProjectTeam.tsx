import { TeamMember } from '@/types';

interface ProjectTeamProps {
  team: TeamMember[];
}

export function ProjectTeam({ team }: ProjectTeamProps) {
  return (
    <div className="space-y-4">
      {team.map((member) => (
        <div
          key={member.id}
          className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
        >
          <div className="flex-shrink-0">
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={member.name}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {member.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {member.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {member.role}
            </p>
            <div className="mt-1 flex flex-wrap gap-1">
              {member.skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Disponibilidade:
              </span>
              <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">
                {member.availability}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 