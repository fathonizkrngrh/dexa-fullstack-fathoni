'use client';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { Container, Content } from 'rsuite';

export default function LoginLayout({ children }: { children: ReactNode }) {
	return (
		<Container className="flex min-h-screen items-center bg-slate-50">
			<Content className="w-full flex justify-center">
				{children}
			</Content>
		</Container>
	);
}
