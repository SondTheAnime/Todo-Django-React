import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import Dashboard from '../pages/Dashboard';
import TaskList from '../pages/Tasks/TaskList';
import TaskForm from '../pages/Tasks/TaskForm';
import CategoryList from '../pages/Categories/CategoryList';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/tasks',
        element: <TaskList />
      },
      {
        path: '/tasks/new',
        element: <TaskForm />
      },
      {
        path: '/categories',
        element: <CategoryList />
      }
    ]
  }
]); 