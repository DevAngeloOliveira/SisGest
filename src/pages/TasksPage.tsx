import { useState, useEffect } from 'react';
import { Task } from '@/types/task.types';
import { taskService } from '@/features/tasks/services/taskService';
import { useNotification } from '@/hooks/useNotification';
import { TaskList } from '@/features/tasks/components/TaskList';

export function TasksPage() {
  const notification = useNotification();
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

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <TaskList tasks={currentTasks} onEdit={() => {}} onDelete={() => {}} />
    </div>
  );
} 