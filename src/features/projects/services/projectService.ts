import { CACHE_KEYS } from '../../../constants/cache';
import { Project, ProjectFormData } from '../types/projects.types';
import { cacheService } from '../../../services/cacheService';
import { logService } from '../../logs/services/logService';

interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
}

class ProjectService {
  private getProjectsFromCache(): Project[] {
    return cacheService.get<Project[]>('projects') || [];
  }

  private saveProjectsToCache(projects: Project[]): void {
    cacheService.set('projects', projects);
  }

  private updateDashboardStats(oldProject?: Project, newProject?: Project): void {
    const stats = cacheService.get<ProjectStats>('dashboardStats') || {
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0
    };

    if (newProject && !oldProject) {
      stats.totalProjects++;
      if (newProject.status === 'IN_PROGRESS') stats.activeProjects++;
      if (newProject.status === 'COMPLETED') stats.completedProjects++;
    } 
    else if (oldProject && newProject) {
      if (oldProject.status !== newProject.status) {
        if (oldProject.status === 'IN_PROGRESS') stats.activeProjects--;
        if (oldProject.status === 'COMPLETED') stats.completedProjects--;
        if (newProject.status === 'IN_PROGRESS') stats.activeProjects++;
        if (newProject.status === 'COMPLETED') stats.completedProjects++;
      }
    }
    else if (oldProject && !newProject) {
      stats.totalProjects--;
      if (oldProject.status === 'IN_PROGRESS') stats.activeProjects--;
      if (oldProject.status === 'COMPLETED') stats.completedProjects--;
    }

    cacheService.set('dashboardStats', stats);
  }

  async getProjects(): Promise<Project[]> {
    return this.getProjectsFromCache();
  }

  async getProjectById(id: string): Promise<Project> {
    const projects = this.getProjectsFromCache();
    const project = projects.find(p => p.id === id);
    if (!project) {
      throw new Error('Projeto não encontrado');
    }
    return project;
  }

  async createProject(data: ProjectFormData, userId: string, userName: string, userRole: string): Promise<Project> {
    const projects = this.getProjectsFromCache();
    
    const newProject: Project = {
      id: crypto.randomUUID(),
      ...data,
      status: data.status || 'PLANNING',
      priority: data.priority || 'MEDIUM',
      progress: 0,
      team: data.team.map(member => ({
        id: typeof member === 'string' ? member : member.id,
        name: typeof member === 'string' ? '' : member.name,
        role: typeof member === 'string' ? '' : member.role
      })),
      timeline: {
        phases: []
      },
      metrics: {
        plannedProgress: 0,
        actualProgress: 0,
        costVariance: 0,
        scheduleVariance: 0,
        taskCompletionRate: 0,
        teamUtilization: 0,
        riskCount: { high: 0, medium: 0, low: 0 }
      },
      qualityMetrics: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    projects.push(newProject);
    this.saveProjectsToCache(projects);
    this.updateDashboardStats(undefined, newProject);

    // Registra o log
    await logService.logProjectAction(
      'CREATED',
      {
        name: newProject.name,
        id: newProject.id,
        manager: newProject.manager,
        team: newProject.team,
        startDate: newProject.startDate,
        endDate: newProject.endDate
      },
      userId,
      userName,
      userRole
    );

    return newProject;
  }

  async updateProject(id: string, data: ProjectFormData): Promise<Project> {
    const projects = this.getProjectsFromCache();
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Projeto não encontrado');
    }

    const oldProject = projects[index];
    const updatedProject: Project = {
      ...oldProject,
      ...data,
      id,
      updatedAt: new Date(),
    };

    projects[index] = updatedProject;
    this.saveProjectsToCache(projects);
    this.updateDashboardStats(oldProject, updatedProject);

    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    const projects = this.getProjectsFromCache();
    const projectToDelete = projects.find(p => p.id === id);
    
    if (!projectToDelete) {
      throw new Error('Projeto não encontrado');
    }

    // Verifica se existem tarefas associadas
    const tasks = cacheService.get<Record<string, unknown>[]>(CACHE_KEYS.tasks) || [];
    const hasAssociatedTasks = tasks.some(task => task.projectId === id);

    if (hasAssociatedTasks) {
      throw new Error('Não é possível excluir um projeto com tarefas associadas');
    }

    const updatedProjects = projects.filter(p => p.id !== id);
    this.saveProjectsToCache(updatedProjects);

    // Registra a exclusão nos logs
    const logs: unknown[] = cacheService.get(CACHE_KEYS.logs) || [];
    logs.push({
      id: crypto.randomUUID(),
      type: 'PROJECT_DELETED',
      description: `Projeto "${projectToDelete.name}" foi excluído`,
      timestamp: new Date()
    });
    cacheService.set(CACHE_KEYS.logs, logs);
  }

  async archiveProject(id: string): Promise<void> {
    const projects = this.getProjectsFromCache();
    const projectIndex = projects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      throw new Error('Projeto não encontrado');
    }

    projects[projectIndex] = {
      ...projects[projectIndex],
      status: 'ARCHIVED',
      updatedAt: new Date()
    };

    this.saveProjectsToCache(projects);
  }

  getProjectStats(projectId: string) {
    return cacheService.getProjectStats(projectId);
  }

  async syncProjects(): Promise<boolean> {
    return cacheService.sync();
  }
}

export const projectService = new ProjectService(); 