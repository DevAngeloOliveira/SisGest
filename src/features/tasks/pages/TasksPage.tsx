import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { taskService } from '../services/taskService';
import { TaskList } from '../components/TaskList';
import { TaskFormModal } from '../components/TaskFormModal';

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleEditTask = async (task: Task) => {
    try {
      const updatedTask = await taskService.updateTask(task.id, task);
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tarefas</h1>
        <button
          onClick={() => {
            setSelectedTask(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
        >
          Nova Tarefa
        </button>
      </div>

      <TaskList
        tasks={tasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />

      {isModalOpen && (
        <TaskFormModal
          task={selectedTask}
          onClose={() => setIsModalOpen(false)}
          onSave={async (data) => {
            if (selectedTask) {
              await handleEditTask({ ...selectedTask, ...data });
            } else {
              const newTask = await taskService.createTask(data);
              setTasks(prev => [...prev, newTask]);
            }
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
} 