import { Outlet } from 'react-router-dom';
import { classNames } from 'primereact/utils';

export default function AuthLayout() {
    return (
        <div className={classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden')}>
            <div className="flex flex-column align-items-center justify-content-center">
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
} 