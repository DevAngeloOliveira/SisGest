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

### Autenticação
- Login e registro de usuários
- Recuperação de senha
- Persistência de sessão
- Níveis de acesso:
  - Administrador
  - Gerente
  - Colaborador

### Interface
- Design responsivo
- Tema claro/escuro
- Animações suaves
- Navegação intuitiva
- Sistema de notificações
- Breadcrumbs dinâmicos

### Sistema de Logs
- Registro de ações do usuário
- Logs do sistema
- Exportação em CSV/JSON
- Filtros avançados
- Análise e estatísticas

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
