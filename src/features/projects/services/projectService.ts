import { Project } from '../types/project.types';
import { api } from '@/services/api';
import { cacheService } from '@/services/cacheService';

const CACHE_KEY = 'projects';
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutos

class ProjectService {
  async getProjects(): Promise<Project[]> {
    try {
      // Tenta obter do cache primeiro
      const cachedProjects = await cacheService.get<Project[]>(CACHE_KEY);
      if (cachedProjects) {
        return cachedProjects;
      }

      // Se não estiver em cache, busca da API
      const response = await api.get<Project[]>('/projects');
      const projects = response.data;

      // Salva no cache
      await cacheService.set(CACHE_KEY, projects, CACHE_DURATION);
      await cacheService.setProjects(projects); // Salva também no store específico

      return projects;
    } catch (error) {
      // Em caso de erro de rede, tenta buscar do store específico
      const offlineProjects = await cacheService.getProjects();
      if (offlineProjects && offlineProjects.length > 0) {
        return offlineProjects;
      }
      throw error;
    }
  }

  async getProject(id: string): Promise<Project> {
    try {
      // Tenta obter do cache específico primeiro
      const cachedProject = await cacheService.getProject(id);
      if (cachedProject) {
        return cachedProject;
      }

      const response = await api.get<Project>(`/projects/${id}`);
      const project = response.data;

      // Salva no cache específico
      await cacheService.setProjects([project]);

      return project;
    } catch (error) {
      throw error;
    }
  }

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const response = await api.post<Project>('/projects', project);
    const newProject = response.data;

    // Atualiza os caches
    const projects = await cacheService.get<Project[]>(CACHE_KEY) || [];
    await cacheService.set(CACHE_KEY, [...projects, newProject], CACHE_DURATION);
    await cacheService.setProjects([...projects, newProject]);

    return newProject;
  }

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const response = await api.put<Project>(`/projects/${id}`, project);
    const updatedProject = response.data;

    // Atualiza os caches
    const projects = await cacheService.get<Project[]>(CACHE_KEY) || [];
    const updatedProjects = projects.map(p => p.id === id ? updatedProject : p);
    await cacheService.set(CACHE_KEY, updatedProjects, CACHE_DURATION);
    await cacheService.setProjects(updatedProjects);

    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);

    // Atualiza os caches
    const projects = await cacheService.get<Project[]>(CACHE_KEY) || [];
    const filteredProjects = projects.filter(p => p.id !== id);
    await cacheService.set(CACHE_KEY, filteredProjects, CACHE_DURATION);
    await cacheService.removeProject(id);
  }
}

export const projectService = new ProjectService(); 