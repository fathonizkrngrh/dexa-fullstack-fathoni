"use client";
import NavBar from '@/components/layout/Navbar';
import { logout } from '@/services/authService';
import { ReactNode } from 'react';
import { Container, Content } from 'rsuite';

export default function EmployeeLayout({ children }: { children: ReactNode }) {
	const APILogout = async () => {
		try {
			await logout();
			window.location.href = '/login';
		} catch (error) {
			console.error('Logout failed', error);
		}
	};
  
	return (
		<div className='flex min-h-screen justify-center bg-slate-50'>
			<div className='flex w-full h-fit bg-slate-200'>
				<Container className='w-full max-w-xl mx-auto'>
					<NavBar logout={APILogout} />
				</Container>
			</div>
			<Container className='w-full max-w-xl mx-auto p-4'>{children}</Container>
		</div>
	);
}
