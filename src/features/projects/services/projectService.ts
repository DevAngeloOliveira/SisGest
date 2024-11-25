import { Project, ProjectFormData } from '@/types/project.types';
import { cacheService } from '@/services/cacheService';
import { logService } from '@/features/logs/services/logService';

class ProjectService {
  async getProjects(): Promise<Project[]> {
    const projects = cacheService.getProjects();
    return projects.map(project => ({
      ...project,
      timeline: {
        ...project.timeline,
        phases: [],
        milestones: project.timeline?.milestones || []
      },
      tasks: []
    }));
  }

  async getProjectById(id: string): Promise<Project | null> {
    const projects = await this.getProjects();
    return projects.find(p => p.id === id) || null;
  }

  async createProject(
    data: ProjectFormData,
    userId: string,
    userName: string,
    userRole: string
  ): Promise<Project> {
    const projects = await this.getProjects();
    
    const newProject: Project = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: 0,
      tasks: [],
      timeline: {
        phases: [],
        start: new Date(data.startDate),
        end: new Date(data.endDate),
        milestones: []
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
      budget: {
        estimated: 0,
        spent: 0,
        currency: 'BRL',
        categories: {},
        expenses: []
      },
      qualityMetrics: []
    };

    projects.push(newProject);
    await cacheService.setProjects(projects);

    await logService.logUserAction(
      'PROJECT_CREATE',
      userId,
      userName,
      userRole,
      { id: newProject.id, name: newProject.name }
    );

    return newProject;
  }

  async updateProject(
    id: string,
    data: Partial<Project>
  ): Promise<Project> {
    const projects = await this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Projeto não encontrado');
    }

    const updatedProject = {
      ...projects[index],
      ...data,
      updatedAt: new Date()
    };

    projects[index] = updatedProject;
    await cacheService.setProjects(projects);

    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    const projects = await this.getProjects();
    const filteredProjects = projects.filter(p => p.id !== id);
    await cacheService.setProjects(filteredProjects);
  }

  async syncProjects(): Promise<void> {
    // Implementação futura
    return Promise.resolve();
  }
}

export const projectService = new ProjectService(); 