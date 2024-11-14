import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { useAuth } from '../contexts/AuthContext';

export default function AppLayout() {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();

    const menuItems: MenuItem[] = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            command: () => navigate('/')
        },
        {
            label: 'Tarefas',
            icon: 'pi pi-check-square',
            command: () => navigate('/tasks')
        },
        {
            label: 'Categorias',
            icon: 'pi pi-tags',
            command: () => navigate('/categories')
        },
        {
            separator: true
        },
        {
            label: 'Sair',
            icon: 'pi pi-sign-out',
            command: async () => {
                await logout();
                navigate('/auth/login');
            }
        }
    ];

    return (
        <div className="min-h-screen flex flex-column relative lg:static surface-ground">
            <div className="h-4rem flex justify-content-between align-items-center px-4 surface-card shadow-2 relative">
                <Button 
                    icon="pi pi-bars" 
                    onClick={() => setSidebarVisible(true)}
                    className="lg:hidden" 
                    text 
                    rounded
                />
                <div className="text-2xl font-bold">Task Manager</div>
                <Button 
                    icon="pi pi-user" 
                    text 
                    rounded
                />
            </div>

            <div className="flex flex-1">
                <Sidebar 
                    visible={sidebarVisible} 
                    onHide={() => setSidebarVisible(false)}
                    className="lg:hidden"
                >
                    <Menu model={menuItems} className="w-full" />
                </Sidebar>

                <div className="hidden lg:block flex-shrink-0 w-18rem">
                    <div className="h-full px-4 py-4 surface-card shadow-2">
                        <Menu model={menuItems} className="w-full" />
                    </div>
                </div>

                <div className="flex-1 p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
} 