<div align="center">

# SisGest - Sistema de Gestão Empresarial

![SisGest Logo](./src/assets/react.svg)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

</div>

## 🚀 Sobre o Projeto

SisGest é um sistema de gestão empresarial moderno desenvolvido com React e TypeScript. O projeto implementa uma arquitetura robusta e escalável, com foco em:

- 🎨 Interface moderna e responsiva com Tailwind CSS
- 🌓 Tema claro/escuro automático e personalizável
- 🔒 Sistema completo de autenticação e autorização
- 📊 Logging detalhado de ações do sistema
- ⚡ Performance otimizada
- 🛡️ Proteção de rotas baseada em permissões

## 🛠️ Tecnologias

### Core
- [React 18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [React Router DOM](https://reactrouter.com/)

### UI/UX
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Toastify](https://fkhadra.github.io/react-toastify/)

### Desenvolvimento
- ESLint
- Prettier
- Git Hooks

## 🌟 Funcionalidades

### 🔐 Sistema de Autenticação e Autorização

#### Visão Geral
O SisGest implementa um sistema robusto de autenticação e autorização, garantindo segurança e controle de acesso granular às funcionalidades do sistema.

#### Níveis de Acesso

##### 👑 Administrador (ADMIN)
- Acesso total ao sistema
- Gerenciamento de usuários
- Visualização de logs do sistema
- Configurações avançadas
- Relatórios administrativos

##### 👔 Gerente (MANAGER)
- Gerenciamento de projetos
- Atribuição de tarefas
- Relatórios gerenciais
- Gestão de equipe

##### 👤 Colaborador (COLLABORATOR)
- Visualização de projetos atribuídos
- Atualização de tarefas
- Perfil pessoal
- Notificações

#### Funcionalidades de Autenticação

##### Login
```typescript
interface LoginCredentials {
  email: string;
  password: string;
}

// Exemplo de uso
const handleLogin = async (credentials: LoginCredentials) => {
  try {
    await login(credentials);
    notification.success('Login realizado com sucesso!');
    navigate('/dashboard');
  } catch (error) {
    notification.error('Credenciais inválidas');
  }
};
```

##### Registro de Usuários
- Validação de dados em tempo real
- Verificação de email único
- Senha com requisitos de segurança
- Atribuição automática de papel inicial (COLLABORATOR)

##### Proteção de Rotas
```typescript
// Exemplo de rota protegida
<ProtectedRoute 
  requiredPermission="manage_users"
  allowedRoles={['ADMIN', 'MANAGER']}
>
  <AdminDashboard />
</ProtectedRoute>
```

#### Segurança

##### Armazenamento Seguro
- Tokens JWT para sessão
- Refresh tokens para persistência
- Senhas criptografadas
- Dados sensíveis protegidos

##### Controle de Sessão
- Timeout automático
- Detecção de inatividade
- Logout em múltiplas abas
- Histórico de login

#### Sistema de Permissões

##### Verificação de Permissões
```typescript
// Hook personalizado para verificação de permissões
const { can } = usePermissions();

// Exemplo de uso
{can('edit_project') && <EditButton />}
```

##### Tipos de Permissões
```typescript
type Permission =
  | 'view_dashboard'
  | 'manage_users'
  | 'edit_project'
  | 'delete_project'
  | 'view_reports'
  | 'manage_team';
```

#### Logs de Autenticação

O sistema mantém um registro detalhado de todas as atividades relacionadas à autenticação:

- Tentativas de login (sucesso/falha)
- Alterações de senha
- Atualizações de perfil
- Criação de novos usuários
- Modificações de permissões

#### Fluxo de Autenticação

1. **Login**
   - Validação de credenciais
   - Geração de token
   - Carregamento de permissões
   - Redirecionamento

2. **Verificação de Sessão**
   - Validação de token
   - Refresh automático
   - Gerenciamento de estado

3. **Logout**
   - Limpeza de tokens
   - Limpeza de estado
   - Redirecionamento para login

#### Exemplos de Uso

##### Context Provider
```typescript
<AuthProvider>
  <ThemeProvider>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </ThemeProvider>
</AuthProvider>
```

##### Hook de Autenticação
```typescript
const { user, login, logout, isAuthenticated } = useAuth();

// Verificar autenticação
if (!isAuthenticated) {
  return <Navigate to="/login" />;
}

// Verificar papel do usuário
if (user?.role === 'ADMIN') {
  // Renderizar conteúdo administrativo
}
```

#### Próximas Atualizações

- [ ] Autenticação com provedores externos (Google, GitHub)
- [ ] Autenticação em dois fatores (2FA)
- [ ] Recuperação de senha por email
- [ ] Bloqueio temporário após tentativas falhas
- [ ] Auditoria avançada de sessões

### 📋 Sistema de Projetos e Tarefas

#### Visão Geral
O SisGest oferece um sistema completo de gerenciamento de projetos e tarefas, permitindo organização eficiente e acompanhamento de atividades em tempo real.

#### Estrutura de Dados

##### Projeto
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  budget?: number;
  manager: User;
  team: User[];
  tasks: Task[];
  progress: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

type ProjectStatus = 
  | 'PLANNING'
  | 'IN_PROGRESS'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'CANCELLED';
```

##### Tarefa
```typescript
interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: User;
  dueDate?: Date;
  estimatedHours?: number;
  completedAt?: Date;
  attachments: Attachment[];
  comments: Comment[];
  subtasks: Subtask[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

type TaskStatus = 
  | 'TODO'
  | 'IN_PROGRESS'
  | 'IN_REVIEW'
  | 'DONE'
  | 'BLOCKED';

type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
```

#### Funcionalidades

##### Gestão de Projetos

###### Criação e Edição
```typescript
// Exemplo de criação de projeto
const createProject = async (projectData: CreateProjectDTO) => {
  try {
    const newProject = await projectService.create(projectData);
    await logService.logProjectAction(
      'CREATED',
      newProject,
      user.id,
      user.name,
      user.role
    );
    notification.success('Projeto criado com sucesso!');
    return newProject;
  } catch (error) {
    notification.error('Erro ao criar projeto');
    throw error;
  }
};
```

###### Acompanhamento de Progress
```typescript
const calculateProjectProgress = (project: Project): number => {
  const completedTasks = project.tasks.filter(
    task => task.status === 'DONE'
  ).length;
  return (completedTasks / project.tasks.length) * 100;
};
```

###### Gestão de Equipe
```typescript
interface TeamManagement {
  addMember: (projectId: string, userId: string) => Promise<void>;
  removeMember: (projectId: string, userId: string) => Promise<void>;
  updateRole: (projectId: string, userId: string, role: string) => Promise<void>;
}
```

##### Gestão de Tarefas

###### Criação e Atribuição
```typescript
// Exemplo de atribuição de tarefa
const assignTask = async (taskId: string, userId: string) => {
  try {
    const updatedTask = await taskService.assign(taskId, userId);
    await logService.logTaskAction(
      'TASK_ASSIGNED',
      updatedTask,
      user.id,
      user.name,
      user.role
    );
    notification.success('Tarefa atribuída com sucesso!');
    return updatedTask;
  } catch (error) {
    notification.error('Erro ao atribuir tarefa');
    throw error;
  }
};
```

###### Sistema de Comentários
```typescript
interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  attachments?: Attachment[];
  createdAt: Date;
  updatedAt?: Date;
}
```

###### Subtarefas
```typescript
interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
}
```

#### Visualizações

##### Dashboard de Projeto
- Visão geral do projeto
- Gráficos de progresso
- Timeline de atividades
- Métricas importantes
- Lista de tarefas pendentes

##### Kanban Board
```typescript
interface KanbanBoard {
  columns: {
    [key in TaskStatus]: Task[];
  };
  moveTask: (taskId: string, source: TaskStatus, target: TaskStatus) => void;
}
```

##### Timeline
```typescript
interface TimelineEvent {
  id: string;
  title: string;
  date: Date;
  type: 'TASK' | 'MILESTONE' | 'DEADLINE';
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
}
```

#### Relatórios e Análises

##### Métricas de Projeto
```typescript
interface ProjectMetrics {
  totalTasks: number;
  completedTasks: number;
  overdueTask: number;
  averageCompletionTime: number;
  teamPerformance: {
    userId: string;
    completedTasks: number;
    averageTime: number;
  }[];
}
```

##### Exportação de Dados
```typescript
// Exemplo de exportação
const exportProjectReport = async (projectId: string, format: 'pdf' | 'excel') => {
  const data = await projectService.generateReport(projectId);
  return reportService.export(data, format);
};
```

#### Integrações

##### Notificações
```typescript
interface TaskNotification {
  type: 'ASSIGNMENT' | 'DUE_SOON' | 'MENTION' | 'COMMENT';
  taskId: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
```

##### Calendário
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'TASK' | 'MEETING' | 'DEADLINE';
  projectId?: string;
  taskId?: string;
}
```

#### Próximas Atualizações

- [ ] Integração com ferramentas externas (Jira, Trello)
- [ ] Sistema de templates de projetos
- [ ] Automação de workflows
- [ ] Métricas avançadas e BI
- [ ] Sistema de gamificação
- [ ] Timetracking integrado

### Interface
- Design responsivo
- Tema claro/escuro
- Animações suaves
- Navegação intuitiva
- Sistema de notificações
- Breadcrumbs dinâmicos

### 📊 Sistema de Logs

#### Visão Geral
O SisGest implementa um sistema abrangente de logging que registra todas as ações importantes do sistema, permitindo auditoria completa e análise de atividades.

#### Tipos de Logs

##### 🔵 Logs de Usuário
```typescript
type UserLogType = 
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_DELETED';
```

##### 🟢 Logs de Projeto
```typescript
type ProjectLogType = 
  | 'PROJECT_CREATED'
  | 'PROJECT_UPDATED'
  | 'PROJECT_DELETED'
  | 'PROJECT_ARCHIVED'
  | 'PROJECT_STATUS_CHANGED';
```

##### 🟡 Logs de Tarefas
```typescript
type TaskLogType = 
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_DELETED'
  | 'TASK_STATUS_CHANGED'
  | 'TASK_ASSIGNED'
  | 'TASK_COMMENT_ADDED';
```

##### 🔴 Logs de Sistema
```typescript
type SystemLogType = 
  | 'SYSTEM_ERROR'
  | 'SYNC_STARTED'
  | 'SYNC_COMPLETED'
  | 'SYNC_ERROR';
```

#### Estrutura do Log
```typescript
interface Log {
  id: string;
  type: LogType;
  description: string;
  userId: string;
  userName: string;
  userRole: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
  severity: 'INFO' | 'WARNING' | 'ERROR';
}
```

#### Funcionalidades

##### Registro Automático
- Interceptação de ações do usuário
- Captura de erros do sistema
- Registro de mudanças de estado
- Tracking de performance

##### Exportação de Logs
```typescript
// Exemplo de exportação
const logs = await logService.exportLogs('csv');
// ou
const logs = await logService.exportLogs('json');
```

##### Filtros Avançados
```typescript
const filteredLogs = await logService.searchLogs({
  type: ['USER_LOGIN', 'USER_LOGOUT'],
  userId: 'user123',
  severity: ['ERROR'],
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
  search: 'login failed'
});
```

##### Análise e Estatísticas
```typescript
const stats = await logService.getLogStats();
// Retorna:
{
  total: number;
  byType: Record<LogType, number>;
  bySeverity: Record<string, number>;
  recentActivity: { date: Date; count: number; }[];
}
```

### 💾 Sistema de Cache

#### Visão Geral
O SisGest utiliza um sistema de cache local para otimizar performance e permitir funcionamento offline parcial.

#### Estrutura do Cache

##### Chaves do Cache
```typescript
export const CACHE_KEYS = {
  tasks: 'tasks',
  projects: 'projects',
  users: 'users',
  logs: 'logs',
  dashboardStats: 'dashboardStats'
} as const;
```

##### Serviço de Cache
```typescript
class CacheService {
  set<T>(key: CacheKeys, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  get<T>(key: CacheKeys): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  remove(key: CacheKeys): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
```

#### Estratégias de Cache

##### Cache de Usuários
```typescript
// Exemplo de uso
const users = cacheService.getUsers();
cacheService.setUsers([...users, newUser]);
```

##### Cache de Projetos
```typescript
// Exemplo de uso
const projects = cacheService.getProjects();
const updatedProjects = projects.map(p => 
  p.id === projectId ? { ...p, ...updates } : p
);
cacheService.setProjects(updatedProjects);
```

##### Cache de Logs
```typescript
// Exemplo de uso
const logs = cacheService.get<Log[]>(CACHE_KEYS.logs) || [];
logs.unshift(newLog);
cacheService.set(CACHE_KEYS.logs, logs);
```

#### Funcionalidades

##### Persistência de Dados
- Armazenamento local de dados frequentes
- Sincronização com backend
- Fallback para modo offline
- Limpeza automática de cache antigo

##### Otimização de Performance
- Carregamento instantâneo de dados em cache
- Redução de requisições ao servidor
- Experiência offline-first
- Atualização em background

##### Gestão de Estado
```typescript
// Exemplo de uso com Context
const [cachedData, setCachedData] = useState(() => {
  return cacheService.get(CACHE_KEYS.dashboardStats) || initialState;
});

useEffect(() => {
  cacheService.set(CACHE_KEYS.dashboardStats, cachedData);
}, [cachedData]);
```

#### Segurança do Cache

##### Sanitização de Dados
```typescript
const sanitizeDataForCache = (data: unknown) => {
  // Remove dados sensíveis
  // Valida estrutura
  // Limita tamanho
  return sanitizedData;
};
```

##### Expiração de Cache
```typescript
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

const isExpired = (item: CacheItem<unknown>) => {
  const now = Date.now();
  return now - item.timestamp > item.expiresIn;
};
```

#### Próximas Atualizações

- [ ] Implementação de Service Workers
- [ ] Sincronização em background
- [ ] Compressão de dados em cache
- [ ] Cache de imagens e assets
- [ ] Sistema de versionamento de cache

## 🏗️ Arquitetura

O projeto segue uma arquitetura Feature-First, organizando o código por funcionalidades:

```
src/
├── features/          # Funcionalidades principais
│   ├── auth/         # Autenticação
│   └── logs/         # Sistema de logs
├── components/        # Componentes reutilizáveis
├── contexts/         # Contextos React
├── hooks/            # Hooks personalizados
└── services/         # Serviços da aplicação
```

## 🚀 Começando

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/sisgest.git

# Entre no diretório
cd sisgest

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=sua_url_api
VITE_APP_NAME=SisGest
```

## 📱 Screenshots

### Tema Claro
![Login - Tema Claro](path_to_light_theme_screenshot.png)

### Tema Escuro
![Dashboard - Tema Escuro](path_to_dark_theme_screenshot.png)

## 🔒 Segurança

- Autenticação segura
- Proteção contra XSS
- Sanitização de inputs
- CSRF Protection
- Rotas protegidas

## ⚡ Performance

- Code Splitting automático
- Lazy Loading de componentes
- Otimização de imagens
- Memoização estratégica
- Bundle size otimizado

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes.

## 👤 Autor

Seu Nome
- LinkedIn: [seu-linkedin](https://linkedin.com/in/seu-usuario)
- GitHub: [@seu-usuario](https://github.com/seu-usuario)

---

<div align="center">
  Feito com ❤️ por [Seu Nome]
</div>
