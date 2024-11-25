import { useState, useEffect } from 'react';
import { Task } from '@/types/task.types';
import { taskService } from '@/features/tasks/services/taskService';
import { useNotification } from '@/hooks/useNotification';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { TaskList } from '../components/TaskList';

export function TasksPage() {
  const notification = useNotification();
  const { user } = useAuth();
  const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const tasksData = await taskService.getAllTasks();
      setCurrentTasks(tasksData);
    } catch {
      notification.error('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = async (task: Task) => {
    try {
      if (!user) return;
      await taskService.updateTask(
        task.id,
        task,
        user.id,
        user.name,
        user.role
      );
      loadTasks();
      notification.success('Tarefa atualizada com sucesso');
    } catch {
      notification.error('Erro ao atualizar tarefa');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      if (!user) return;
      await taskService.deleteTask(
        taskId,
        user.id,
        user.name,
        user.role
      );
      loadTasks();
      notification.success('Tarefa excluída com sucesso');
    } catch {
      notification.error('Erro ao excluir tarefa');
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <TaskList 
        tasks={currentTasks} 
        onEdit={handleEditTask} 
        onDelete={handleDeleteTask} 
      />
    </div>
  );
} 