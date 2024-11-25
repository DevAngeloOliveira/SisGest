import { Task, TaskFormData } from '@/types/task.types';
import { cacheService } from '@/services/cacheService';
import { logService } from '@/features/logs/services/logService';

class TaskService {
  async getAllTasks(): Promise<Task[]> {
    return cacheService.getTasks();
  }

  async getTaskById(id: string): Promise<Task | null> {
    const tasks = await this.getAllTasks();
    return tasks.find(t => t.id === id) || null;
  }

  async createTask(
    data: TaskFormData,
    userId: string,
    userName: string,
    userRole: string
  ): Promise<Task> {
    const tasks = await this.getAllTasks();
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
      comments: [],
      subtasks: []
    };

    tasks.push(newTask);
    cacheService.setTasks(tasks);

    await logService.logTaskAction(
      'TASK_CREATE',
      { id: newTask.id, title: newTask.title },
      userId,
      userName,
      userRole
    );

    return newTask;
  }

  async updateTask(
    id: string,
    data: Partial<Task>,
    userId: string,
    userName: string,
    userRole: string
  ): Promise<Task> {
    const tasks = await this.getAllTasks();
    const index = tasks.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error('Tarefa não encontrada');
    }

    const updatedTask = {
      ...tasks[index],
      ...data,
      updatedAt: new Date()
    };

    tasks[index] = updatedTask;
    cacheService.setTasks(tasks);

    await logService.logTaskAction(
      'TASK_UPDATE',
      { id: updatedTask.id, title: updatedTask.title },
      userId,
      userName,
      userRole
    );

    return updatedTask;
  }

  async deleteTask(
    id: string,
    userId: string,
    userName: string,
    userRole: string
  ): Promise<void> {
    const tasks = await this.getAllTasks();
    const task = tasks.find(t => t.id === id);
    
    if (!task) {
      throw new Error('Tarefa não encontrada');
    }

    const filteredTasks = tasks.filter(t => t.id !== id);
    cacheService.setTasks(filteredTasks);

    await logService.logTaskAction(
      'TASK_DELETE',
      { id: task.id, title: task.title },
      userId,
      userName,
      userRole
    );
  }
}

export const taskService = new TaskService(); 