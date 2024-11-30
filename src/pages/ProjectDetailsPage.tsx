import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Project, User } from '../types';
import { projectService } from '../features/projects/services/projectService';
import { Card } from '../components/shared/Card';

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        if (id) {
          const data = await projectService.getProjectById(id);
          setProject(data);
        }
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Projeto não encontrado</h2>
        <p className="mt-2 text-gray-600">O projeto que você está procurando não existe.</p>
      </div>
    );
  }

  const manager = project.manager || projectService.getDefaultManager();
  const team = (project.team || []).filter((member): member is User => {
    return member && typeof member === 'object' && 'name' in member && typeof member.name === 'string';
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
        <p className="mt-2 text-gray-600">{project.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Informações Gerais">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1">{project.status}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Progresso</h3>
              <div className="mt-1 relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${project.progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                  ></div>
                </div>
                <span className="text-xs text-gray-600 mt-1">{project.progress}%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Datas">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Data de Início</h3>
              <p className="mt-1">{new Date(project.startDate).toLocaleDateString()}</p>
            </div>
            {project.endDate && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Data de Término</h3>
                <p className="mt-1">{new Date(project.endDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </Card>

        <Card title="Equipe">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Gerente</h3>
              <div className="mt-1 flex items-center space-x-2">
                {manager.avatar ? (
                  <img
                    src={manager.avatar}
                    alt={manager.name}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {manager.name ? manager.name.charAt(0) : '?'}
                    </span>
                  </div>
                )}
                <span>{manager.name || 'Sem nome'}</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Membros</h3>
              <div className="mt-1 flex flex-wrap gap-2">
                {team.length > 0 ? (
                  team.map(member => (
                    <div
                      key={member.id}
                      className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1"
                    >
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-6 w-6 rounded-full"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-primary-500 flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="text-sm">{member.name}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Nenhum membro na equipe</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 