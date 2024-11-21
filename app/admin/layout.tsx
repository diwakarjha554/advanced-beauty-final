import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import DashboardSideBar from '@/components/admin/side-bar';

interface RoutesLayoutProps {
    children: React.ReactNode;
}

const RoutesLayout: React.FC<RoutesLayoutProps> = ({ children }) => {
    return (
        <SidebarProvider>
            <DashboardSideBar />
            <main className='w-full'>
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    );
};

export default RoutesLayout;
