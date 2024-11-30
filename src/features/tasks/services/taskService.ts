import { Task, ID } from '@/types';

class TaskService {
  private storageKey = '@sisgest:tasks';

  async getTasks(): Promise<Task[]> {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  async getTaskById(id: ID): Promise<Task | null> {
    const tasks = await this.getTasks();
    return tasks.find(t => t.id === id) || null;
  }

  async createTask(data: Partial<Task>): Promise<Task> {
    const tasks = await this.getTasks();

    const newTask: Task = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      updatedBy: 'system',
      progress: 0,
      estimatedHours: 0,
      actualHours: 0,
      dependencies: [],
      attachments: [],
      comments: []
    } as Task;

    tasks.push(newTask);
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    return newTask;
  }

  async updateTask(id: ID, data: Partial<Task>): Promise<Task> {
    const tasks = await this.getTasks();
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
      throw new Error('Task not found');
    }

    const updatedTask = {
      ...tasks[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    tasks[index] = updatedTask;
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    return updatedTask;
  }

  async deleteTask(id: ID): Promise<void> {
    const tasks = await this.getTasks();
    const filteredTasks = tasks.filter(t => t.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filteredTasks));
  }
}

export const taskService = new TaskService(); 