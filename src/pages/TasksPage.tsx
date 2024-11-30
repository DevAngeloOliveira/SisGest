import { useEffect, useState } from 'react';
import { Task } from '../types';
import { taskService } from '../features/tasks/services/taskService';
import { Card } from '../components/shared/Card';

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tarefas</h1>
        <button
          onClick={() => {}}
          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
        >
          Nova Tarefa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
          <Card key={task.id} title={task.title}>
            <div className="space-y-4">
              <p className="text-gray-600 line-clamp-2">{task.description}</p>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Status: {task.status}</span>
                <span className="text-gray-500">
                  Progresso: {task.progress}%
                </span>
              </div>

              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${task.progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                  ></div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Responsável:</span>
                <div className="flex items-center">
                  {task.assignee.avatar ? (
                    <img
                      src={task.assignee.avatar}
                      alt={task.assignee.name}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-primary-500 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {task.assignee.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className="ml-2 text-sm">{task.assignee.name}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">
                  Prazo: {new Date(task.dueDate).toLocaleDateString()}
                </span>
                <button
                  onClick={() => {}}
                  className="text-primary-600 hover:text-primary-700"
                >
                  Editar
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 