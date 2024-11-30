import { Project, ID } from '@/types';

class ProjectService {
  private storageKey = '@sisgest:projects';

  async getAll(): Promise<Project[]> {
    return this.getProjects();
  }

  async getProjects(): Promise<Project[]> {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  async getProjectById(id: ID): Promise<Project | null> {
    const projects = await this.getProjects();
    return projects.find(p => p.id === id) || null;
  }

  async createProject(data: Partial<Project>, userId: ID): Promise<Project> {
    const projects = await this.getProjects();

    const newProject: Project = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId,
      updatedBy: userId,
      progress: 0,
      tasks: [],
      team: [],
      timeline: {
        phases: [],
        start: new Date(),
        end: new Date(),
        milestones: []
      },
      objectives: [],
      deliverables: [],
      risks: [],
      budget: {
        estimated: 0,
        actual: 0,
        variance: 0
      }
    } as Project;

    projects.push(newProject);
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
    return newProject;
  }

  async updateProject(id: ID, data: Partial<Project>): Promise<Project> {
    const projects = await this.getProjects();
    const index = projects.findIndex(p => p.id === id);

    if (index === -1) {
      throw new Error('Project not found');
    }

    const updatedProject = {
      ...projects[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    projects[index] = updatedProject;
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
    return updatedProject;
  }

  async deleteProject(id: ID): Promise<void> {
    const projects = await this.getProjects();
    const filteredProjects = projects.filter(p => p.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filteredProjects));
  }

  async syncProjects(): Promise<void> {
    // Implementação futura para sincronização com backend
    return Promise.resolve();
  }
}

export const projectService = new ProjectService(); 