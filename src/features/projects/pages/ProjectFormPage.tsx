import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectFormData, ProjectPriority, ProjectStatus } from '../types/projects.types';
import { projectService } from '../services/projectService';
import { useNotification } from '../../../hooks/useNotification';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { User } from '../../auth/types/auth.types';
import { cacheService } from '../../../services/cacheService';

export function ProjectFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const notification = useNotification();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    status: 'PLANNING',
    priority: 'MEDIUM',
    progress: 0,
    startDate: new Date(),
    endDate: new Date(),
    team: [],
    budget: {
      estimated: 0,
      spent: 0,
      currency: 'BRL'
    },
    manager: user?.id || '',
    tags: [],
    category: '',
    objectives: '',
    deliverables: '',
    risks: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);

  useEffect(() => {
    loadInitialData();
  }, [id]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // Carrega os usuários do cache
      const users = cacheService.getUsers();
      setAvailableUsers(users);

      // Se for edição, carrega o projeto
      if (id) {
        const project = await projectService.getProjectById(id);
        if (project) {
          setFormData({
            ...project,
            manager: project.manager || user?.id || '',
            team: project.team || [],
            budget: project.budget || {
              estimated: 0,
              spent: 0,
              currency: 'BRL'
            }
          });
          // Atualiza os membros selecionados
          setSelectedTeamMembers(project.team.map(member => member.id));
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      notification.error('Erro ao carregar dados do projeto');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Validações adicionais
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        notification.error('A data de início não pode ser posterior à data de término');
        return;
      }

      if (formData.team.length === 0) {
        notification.warning('Recomenda-se adicionar pelo menos um membro à equipe');
      }

      if (id) {
        await projectService.updateProject(id, formData);
        notification.success('Projeto atualizado com sucesso!');
      } else {
        if (!user) {
          notification.error('Usuário não autenticado');
          return;
        }
        await projectService.createProject(formData, user.id, user.name, user.role);
        notification.success('Projeto criado com sucesso!');
      }

      // Força a sincronização após criar/atualizar
      await projectService.syncProjects();
      
      navigate('/projects');
    } catch (error) {
      notification.error('Erro ao salvar projeto');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions: ProjectStatus[] = [
    'PLANNING',
    'IN_PROGRESS', 
    'ON_HOLD',
    'COMPLETED',
    'CANCELLED'
  ];

  const priorityOptions: ProjectPriority[] = [
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT'
  ];

  const getStatusLabel = (status: ProjectStatus) => {
    const labels = {
      'PLANNING': 'Planejamento',
      'IN_PROGRESS': 'Em Progresso',
      'ON_HOLD': 'Em Pausa',
      'COMPLETED': 'Concluído',
      'CANCELLED': 'Cancelado'
    };
    return labels[status];
  };

  const getPriorityLabel = (priority: ProjectPriority) => {
    const labels = {
      'LOW': 'Baixa',
      'MEDIUM': 'Média', 
      'HIGH': 'Alta',
      'URGENT': 'Urgente'
    };
    return labels[priority];
  };

  // Filtra os membros disponíveis para a equipe baseado no papel do usuário atual e do gerente selecionado
  const availableTeamMembers = availableUsers.filter(availableUser => {
    // Não permite adicionar o gerente do projeto como membro da equipe
    if (availableUser.id === formData.manager) {
      return false;
    }

    // Se o usuário atual for admin E for o gerente do projeto, permite adicionar gerentes e colaboradores
    if (user?.role === 'ADMIN' && user?.id === formData.manager) {
      return availableUser.role === 'MANAGER' || availableUser.role === 'COLLABORATOR';
    }

    // Se o usuário atual for admin mas NÃO for o gerente, ou se for outro tipo de usuário,
    // permite apenas colaboradores
    return availableUser.role === 'COLLABORATOR';
  });

  // Função para obter o label do papel do usuário
  const getUserRoleLabel = (role: string) => {
    switch (role) {
      case 'MANAGER':
        return 'Gerente';
      case 'COLLABORATOR':
        return 'Colaborador';
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {id ? 'Editar Projeto' : 'Novo Projeto'}
        </h1>
        <button
          onClick={() => navigate('/projects')}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300"
        >
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informações Básicas */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Informações Básicas</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome do Projeto *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Categoria
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Descrição *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
          </div>
        </div>

        {/* Status e Prioridade */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Status e Prioridade</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {getStatusLabel(status)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Prioridade
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as ProjectPriority })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {getPriorityLabel(priority)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Datas e Progresso */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Datas e Progresso</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Data de Início *
              </label>
              <input
                type="date"
                value={new Date(formData.startDate).toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Data de Término *
              </label>
              <input
                type="date"
                value={new Date(formData.endDate).toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Progresso (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Orçamento */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Orçamento</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Orçamento Estimado
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <input
                  type="number"
                  value={formData.budget?.estimated}
                  onChange={(e) => setFormData({
                    ...formData,
                    budget: { ...formData.budget, estimated: Number(e.target.value) }
                  })}
                  className="pl-12 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Orçamento Gasto
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <input
                  type="number"
                  value={formData.budget?.spent}
                  onChange={(e) => setFormData({
                    ...formData,
                    budget: { ...formData.budget, spent: Number(e.target.value) }
                  })}
                  className="pl-12 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Detalhes Adicionais */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Detalhes Adicionais</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Objetivos
              </label>
              <textarea
                value={formData.objectives}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Entregas
              </label>
              <textarea
                value={formData.deliverables}
                onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Riscos
              </label>
              <textarea
                value={formData.risks}
                onChange={(e) => setFormData({ ...formData, risks: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Observações
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Gerente e Equipe */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Gerente e Equipe</h2>
          <div className="space-y-6">
            {/* Seleção de Gerente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Gerente do Projeto *
              </label>
              <select
                value={formData.manager}
                onChange={(e) => {
                  setFormData({ ...formData, manager: e.target.value });
                  // Remove o gerente da equipe se ele estiver selecionado
                  if (selectedTeamMembers.includes(e.target.value)) {
                    setSelectedTeamMembers(selectedTeamMembers.filter(id => id !== e.target.value));
                    setFormData(prev => ({
                      ...prev,
                      team: prev.team.filter(member => member.id !== e.target.value)
                    }));
                  }
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              >
                <option value="">Selecione um gerente</option>
                {availableUsers
                  .filter(user => user.role === 'MANAGER' || user.role === 'ADMIN')
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role === 'ADMIN' ? 'Administrador' : 'Gerente'})
                    </option>
                  ))}
              </select>
            </div>

            {/* Seleção de Equipe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Membros da Equipe {user?.role === 'ADMIN' && user?.id === formData.manager 
                  ? '(Gerentes e Colaboradores)' 
                  : '(Colaboradores)'}
              </label>
              <div className="space-y-2">
                {availableTeamMembers.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Não há membros disponíveis para adicionar à equipe.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {/* Seção de Gerentes (apenas se for admin E for o gerente do projeto) */}
                    {user?.role === 'ADMIN' && user?.id === formData.manager && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Gerentes</h3>
                        {availableTeamMembers
                          .filter(member => member.role === 'MANAGER')
                          .map((manager) => (
                            <label key={manager.id} className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={selectedTeamMembers.includes(manager.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedTeamMembers([...selectedTeamMembers, manager.id]);
                                    setFormData({
                                      ...formData,
                                      team: [
                                        ...formData.team,
                                        {
                                          id: manager.id,
                                          name: manager.name,
                                          role: manager.role,
                                        }
                                      ]
                                    });
                                  } else {
                                    setSelectedTeamMembers(selectedTeamMembers.filter(id => id !== manager.id));
                                    setFormData({
                                      ...formData,
                                      team: formData.team.filter(member => member.id !== manager.id)
                                    });
                                  }
                                }}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {manager.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {getUserRoleLabel(manager.role)}
                                </p>
                              </div>
                            </label>
                          ))}
                      </div>
                    )}

                    {/* Seção de Colaboradores */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Colaboradores</h3>
                      {availableTeamMembers
                        .filter(member => member.role === 'COLLABORATOR')
                        .map((collaborator) => (
                          <label key={collaborator.id} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={selectedTeamMembers.includes(collaborator.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedTeamMembers([...selectedTeamMembers, collaborator.id]);
                                  setFormData({
                                    ...formData,
                                    team: [
                                      ...formData.team,
                                      {
                                        id: collaborator.id,
                                        name: collaborator.name,
                                        role: collaborator.role,
                                      }
                                    ]
                                  });
                                } else {
                                  setSelectedTeamMembers(selectedTeamMembers.filter(id => id !== collaborator.id));
                                  setFormData({
                                    ...formData,
                                    team: formData.team.filter(member => member.id !== collaborator.id)
                                  });
                                }
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {collaborator.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {getUserRoleLabel(collaborator.role)}
                              </p>
                            </div>
                          </label>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview da Equipe Selecionada */}
            {formData.team.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Equipe Selecionada ({formData.team.length} membros)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {formData.team.map((member) => (
                    <div
                      key={member.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      <span>{member.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTeamMembers(selectedTeamMembers.filter(id => id !== member.id));
                          setFormData({
                            ...formData,
                            team: formData.team.filter(m => m.id !== member.id)
                          });
                        }}
                        className="ml-2 focus:outline-none"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : id ? 'Atualizar Projeto' : 'Criar Projeto'}
          </button>
        </div>
      </form>
    </div>
  );
} 