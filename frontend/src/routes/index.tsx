import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';
import AuthLayout from '../layout/AuthLayout';
import Dashboard from '../pages/Dashboard';
import TaskList from '../pages/Tasks/TaskList';
import TaskForm from '../pages/Tasks/TaskForm';
import CategoryList from '../pages/Categories/CategoryList';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
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
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      }
    ]
  }
]); 