import { Task, TaskComment, TaskAttachment } from '../types/tasks.types';
import { logService } from '../../logs/services/logService';
import { cacheService } from '../../../services/cacheService';

class TaskService {
  private getTasks(): Task[] {
    return cacheService.get<Task[]>('tasks') || [];
  }

  private saveTasks(tasks: Task[]): void {
    cacheService.set('tasks', tasks);
  }

  async getTasksByProjectId(projectId: string): Promise<Task[]> {
    const tasks = this.getTasks();
    if (projectId === 'all') {
      return tasks;
    }
    return tasks.filter(task => task.projectId === projectId);
  }

  async createTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, userId: string, userName: string, userRole: string): Promise<Task> {
    const tasks = this.getTasks();
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
      comments: []
    };

    tasks.push(newTask);
    this.saveTasks(tasks);

    await logService.logTaskAction(
      'TASK_CREATED',
      {
        taskId: newTask.id,
        taskTitle: newTask.title,
        projectId: newTask.projectId,
        assignedTo: newTask.members.map(m => m.name).join(', '),
        status: newTask.status,
        priority: newTask.priority
      },
      userId,
      userName,
      userRole
    );

    return newTask;
  }

  async updateTask(taskId: string, updates: Partial<Task>, userId: string, userName: string, userRole: string): Promise<Task> {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error('Tarefa não encontrada');
    }

    const oldTask = tasks[taskIndex];
    const updatedTask = {
      ...oldTask,
      ...updates,
      updatedAt: new Date()
    };

    tasks[taskIndex] = updatedTask;
    this.saveTasks(tasks);

    if (oldTask.status !== updatedTask.status) {
      await logService.logTaskAction(
        'TASK_STATUS_CHANGED',
        {
          taskId: updatedTask.id,
          taskTitle: updatedTask.title,
          projectId: updatedTask.projectId,
          oldStatus: oldTask.status,
          newStatus: updatedTask.status
        },
        userId,
        userName,
        userRole
      );
    }

    if (JSON.stringify(oldTask.members) !== JSON.stringify(updatedTask.members)) {
      await logService.logTaskAction(
        'TASK_ASSIGNED',
        {
          taskId: updatedTask.id,
          taskTitle: updatedTask.title,
          projectId: updatedTask.projectId,
          assignedTo: updatedTask.members.map(m => m.name).join(', ')
        },
        userId,
        userName,
        userRole
      );
    }

    return updatedTask;
  }

  async deleteTask(taskId: string, userId: string, userName: string, userRole: string): Promise<void> {
    const tasks = this.getTasks();
    const taskToDelete = tasks.find(task => task.id === taskId);
    
    if (!taskToDelete) {
      throw new Error('Tarefa não encontrada');
    }

    const updatedTasks = tasks.filter(task => task.id !== taskId);
    this.saveTasks(updatedTasks);

    await logService.logTaskAction(
      'TASK_DELETED',
      {
        taskId: taskToDelete.id,
        taskTitle: taskToDelete.title,
        projectId: taskToDelete.projectId
      },
      userId,
      userName,
      userRole
    );
  }

  async addComment(
    taskId: string,
    content: string,
    attachments: TaskAttachment[],
    userId: string,
    userName: string,
    userRole: string
  ): Promise<Task> {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error('Tarefa não encontrada');
    }

    const task = tasks[taskIndex];
    const newComment: TaskComment = {
      id: crypto.randomUUID(),
      content,
      authorId: userId,
      authorName: userName,
      createdAt: new Date(),
      attachments: attachments || []
    };

    const updatedTask = {
      ...task,
      comments: [...(task.comments || []), newComment],
      updatedAt: new Date()
    };

    tasks[taskIndex] = updatedTask;
    this.saveTasks(tasks);

    await logService.logTaskAction(
      'TASK_COMMENT_ADDED',
      {
        taskId: task.id,
        taskTitle: task.title,
        projectId: task.projectId,
        commentId: newComment.id
      },
      userId,
      userName,
      userRole
    );

    return updatedTask;
  }

  async searchTasks(filters?: {
    status?: string[];
    priority?: string[];
    members?: string[];
    projectId?: string;
    search?: string;
  }): Promise<Task[]> {
    let tasks = this.getTasks();

    if (filters) {
      tasks = tasks.filter(task => {
        if (filters.status?.length && !filters.status.includes(task.status)) {
          return false;
        }
        if (filters.priority?.length && !filters.priority.includes(task.priority)) {
          return false;
        }
        if (filters.members?.length && !task.members.some(m => filters.members?.includes(m.id))) {
          return false;
        }
        if (filters.projectId && task.projectId !== filters.projectId) {
          return false;
        }
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          return (
            task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm)
          );
        }
        return true;
      });
    }

    return tasks;
  }
}

export const taskService = new TaskService(); 