import { useState, useEffect, useRef } from 'react';
import { Task, TaskFormData } from '../types/tasks.types';
import { taskService } from '../services/taskService';
import { useNotification } from '../../../hooks/useNotification';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { Project } from '../../projects/types/projects.types';
import { projectService } from '../../projects/services/projectService';
import { motion, AnimatePresence } from 'framer-motion';
import { FilePreview } from './FilePreview';
import { TaskModal } from './TaskModal';
import { TaskReport } from './TaskReport';
import { EmojiPicker } from './EmojiPicker';

interface TaskListProps {
  projectId: string;
}

export function TaskList({ projectId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [project, setProject] = useState<Project | null>(null);
  const notification = useNotification();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messageText, setMessageText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const isManagerOrAdmin = user?.role === 'MANAGER' || user?.role === 'ADMIN';
  const isProjectManager = project?.manager === user?.id;
  const canManageTasks = isManagerOrAdmin || isProjectManager;

  useEffect(() => {
    loadTasks();
    loadProject();
  }, [projectId]);

  const loadTasks = async () => {
    try {
      const data = await taskService.getTasksByProjectId(projectId);
      setTasks(data);
    } catch {
      notification.error('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  const loadProject = async () => {
    try {
      const data = await projectService.getProjectById(projectId);
      setProject(data);
    } catch {
      notification.error('Erro ao carregar dados do projeto');
    }
  };

  const handleCreateTask = async (taskData: TaskFormData) => {
    try {
      if (!user) {
        notification.error('Usuário não autenticado');
        return;
      }

      const newTask = await taskService.createTask(
        {
          ...taskData,
          projectId,
          createdBy: user.id,
          comments: [],
          attachments: [],
        },
        user.id,
        user.name,
        user.role
      );
      
      setTasks(prev => [...prev, newTask]);
      notification.success('Tarefa criada com sucesso!');
    } catch {
      notification.error('Erro ao criar tarefa');
    }
  };

  const handleUpdateTask = async (taskId: string, taskData: Partial<Task>) => {
    try {
      if (!user) {
        notification.error('Usuário não autenticado');
        return;
      }

      const updatedTask = await taskService.updateTask(
        taskId, 
        taskData,
        user.id,
        user.name,
        user.role
      );
      
      setTasks(prev => prev.map(task => task.id === taskId ? updatedTask : task));
      notification.success('Tarefa atualizada com sucesso!');
      setIsModalOpen(false);
    } catch {
      notification.error('Erro ao atualizar tarefa');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      if (!user) {
        notification.error('Usuário não autenticado');
        return;
      }

      await taskService.deleteTask(
        taskId,
        user.id,
        user.name,
        user.role
      );
      
      setTasks(prev => prev.filter(task => task.id !== taskId));
      notification.success('Tarefa excluída com sucesso!');
    } catch {
      notification.error('Erro ao excluir tarefa');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [tasks]);

  const handleEmojiSelect = (emoji: string) => {
    setMessageText(prev => prev + emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      
      // Verifica o tamanho dos arquivos
      const invalidFiles = newFiles.filter(file => file.size > 5 * 1024 * 1024);
      if (invalidFiles.length > 0) {
        notification.error(`Alguns arquivos excedem o limite de 5MB: ${invalidFiles.map(f => f.name).join(', ')}`);
        return;
      }

      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddComment = async (taskId: string, comment: string) => {
    try {
      if (!user) {
        notification.error('Usuário não autenticado');
        return;
      }

      const updatedTask = await taskService.addComment(
        taskId,
        comment,
        [],
        user.id,
        user.name,
        user.role
      );

      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));

      notification.success('Comentário adicionado com sucesso!');
    } catch {
      notification.error('Erro ao adicionar comentário');
    }
  };

  // Renderização condicional dos botões de ação
  const renderActionButtons = (task: Task) => {
    if (!canManageTasks) return null;

    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            setSelectedTask(task);
            setIsModalOpen(true);
          }}
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteTask(task.id);
          }}
          className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com botão de nova tarefa */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Tarefas
        </h2>
        {canManageTasks && (
          <button
            onClick={() => {
              setSelectedTask(undefined);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Nova Tarefa
          </button>
        )}
      </div>

      {/* Lista de Tarefas */}
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {task.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {task.description}
                </p>
              </div>
              {renderActionButtons(task)}
            </div>
            {/* ... resto do conteúdo do card */}

            {/* Chat/Comentários */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="h-[400px] overflow-y-auto px-4 py-2 space-y-4 scroll-smooth">
                {task.comments.map((comment) => {
                  const isCurrentUser = comment.authorId === user?.id;
                  return (
                    <div 
                      key={comment.id} 
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} gap-2 group`}
                    >
                      {!isCurrentUser && (
                        <div className="flex-shrink-0 w-8 h-8">
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            {comment.authorName.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      )}

                      <div className={`max-w-[70%] flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                        {!isCurrentUser && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 mb-1">
                            {comment.authorName}
                          </span>
                        )}

                        <div className="flex flex-col gap-1">
                          <div 
                            className={`rounded-2xl px-4 py-2 break-words ${
                              isCurrentUser 
                                ? 'bg-blue-500 text-white dark:bg-blue-600 rounded-br-lg' 
                                : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white rounded-bl-lg'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                          </div>

                          {/* Anexos */}
                          {comment.attachments && comment.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {comment.attachments.map((attachment) => (
                                <a
                                  key={attachment.id}
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`
                                    flex items-center gap-2 p-2 rounded-lg text-sm transition-colors
                                    ${isCurrentUser 
                                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'}
                                  `}
                                >
                                  {attachment.type === 'image' ? (
                                    <img 
                                      src={attachment.url} 
                                      alt={attachment.name}
                                      className="w-32 h-32 object-cover rounded-lg"
                                    />
                                  ) : (
                                    <>
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                      </svg>
                                      <span className="truncate max-w-[140px]">{attachment.name}</span>
                                    </>
                                  )}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>

                        <span className={`
                          text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity
                          ${isCurrentUser ? 'text-right' : 'text-left'}
                        `}>
                          {new Date(comment.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>

                      {isCurrentUser && (
                        <div className="flex-shrink-0 w-8 h-8">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            {comment.authorName.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} /> {/* Elemento de referência para o scroll */}
              </div>

              {/* Área de Input Melhorada */}
              <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (messageText.trim() || selectedFiles.length > 0) {
                      handleAddComment(task.id, messageText);
                      setMessageText('');
                    }
                  }}
                  className="p-2"
                >
                  {/* Preview de Arquivos */}
                  {selectedFiles.length > 0 && (
                    <FilePreview
                      files={selectedFiles}
                      onRemove={handleRemoveFile}
                    />
                  )}

                  {/* Área de Input */}
                  <div className="flex items-end gap-2">
                    <div className="flex-1 relative">
                      <textarea
                        ref={textareaRef}
                        value={messageText}
                        onChange={(e) => {
                          setMessageText(e.target.value);
                          e.target.style.height = 'auto';
                          e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                        }}
                        placeholder="Escreva uma mensagem..."
                        className="w-full resize-none rounded-lg border-0 bg-transparent p-2 focus:ring-0 text-sm min-h-[40px] max-h-[120px]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            e.currentTarget.form?.requestSubmit();
                          }
                        }}
                      />
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex items-center gap-2 p-2">
                      <button
                        type="button"
                        onClick={handleFileButtonClick}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx,.txt"
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      <button
                        type="submit"
                        disabled={!messageText.trim() && selectedFiles.length === 0}
                        className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </form>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2">
                    <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Modais */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
        onSubmit={async (taskData) => {
          if (selectedTask) {
            await handleUpdateTask(selectedTask.id, taskData);
          } else {
            await handleCreateTask(taskData);
          }
        }}
        projectId={projectId}
        availableMembers={project?.team || []}
      />

      {isReportModalOpen && selectedTask && (
        <TaskReport
          task={selectedTask}
          onClose={() => {
            setIsReportModalOpen(false);
            setSelectedTask(undefined);
          }}
        />
      )}
    </div>
  );
} 