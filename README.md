# Sistema de Gerenciamento de Tarefas

## Sobre o Projeto
Sistema web para gerenciamento de tarefas pessoais e profissionais, permitindo aos usuários organizar, priorizar e acompanhar suas atividades de forma eficiente.
Projeto desenvolvido com intuito de aprender e mesclar as tecnologias abaixo, tanto no backend quanto no frontend, fazendo se comunicar entre si via consumo de uma API Rest.

## Tecnologias Utilizadas

### Backend
- Django 5.1.3
- Django REST Framework
- PostgreSQL
- JWT para autenticação
- Docker para containerização

### Frontend
- React 18
- TypeScript
- React Router DOM
- Axios
- TailwindCSS
- Vite


## Funcionalidades Principais

### Autenticação
- Cadastro de usuários
- Login com email e senha
- Recuperação de senha
- Gerenciamento de perfil

### Gerenciamento de Tarefas
- CRUD completo de tarefas
- Definição de prioridade
- Status de progresso
- Data de vencimento
- Categorização

### Dashboard
- Visão geral das tarefas
- Estatísticas
- Filtros e busca
- Ordenação personalizada

## Configuração do Ambiente de Desenvolvimento

### Pré-requisitos
- Docker e Docker Compose
- Node.js 18+
- Python 3.11+


## Estrutura da API

### Endpoints

#### Autenticação
- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `PUT /api/auth/profile` - Atualização de perfil

#### Tarefas
- `GET /api/tasks` - Listar tarefas
- `POST /api/tasks` - Criar tarefa
- `GET /api/tasks/{id}` - Detalhes da tarefa
- `PUT /api/tasks/{id}` - Atualizar tarefa
- `DELETE /api/tasks/{id}` - Excluir tarefa
- `PATCH /api/tasks/{id}/status` - Atualizar status

#### Categorias
- `GET /api/categories` - Listar categorias
- `POST /api/categories` - Criar categoria
- `PUT /api/categories/{id}` - Atualizar categoria
- `DELETE /api/categories/{id}` - Excluir categoria

## Contribuição
1. Fork o projeto
2. Crie uma branch para sua feature 
3. Commit suas mudanças 
4. Push para a branch 
5. Abra um Pull Request

## Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
