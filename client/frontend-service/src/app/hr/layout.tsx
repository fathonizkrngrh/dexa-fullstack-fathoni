'use client';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { logout } from '@/services/authService';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { Container, Content } from 'rsuite';

export default function HRLayout({ children }: { children: ReactNode }) {
	const pathname = usePathname();

	const APILogout = async () => {
		try {
			await logout();
			window.location.href = '/login';
		} catch (error) {
			console.error('Logout failed', error);
		}
	};
	return (
		<div className='flex min-h-screen'>
			<SidebarLayout activeKey={pathname} logout={APILogout} />
			<Container className='p-0 md:px-5 lg:p-10 max-h-full overflow-y-auto'>{children}</Container>
		</div>
	);
}
