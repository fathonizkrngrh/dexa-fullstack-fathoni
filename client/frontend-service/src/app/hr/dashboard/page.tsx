'use client';
import { Employee } from '@/types/employee';
import React, { useEffect, useState } from 'react';
import { Container } from 'rsuite';

function Dashboard() {
	const [employee, setEmployee] = useState<Employee | undefined>();
	useEffect(() => {
		const localEmp = localStorage.getItem('employee') ? (JSON.parse(localStorage.getItem('employee') as string) as Employee) : undefined;
		setEmployee(localEmp);
	}, []);

	return (
		<Container>
			<div className='flex flex-col gap-2'>
				<h1 className='text-2xl font-bold mb-4'>Welcome to HR Dashboard</h1>
				<p className='text-base'>Hello, {employee?.name || 'Employee'}!</p>
				<p className='text-base'>This is your dashboard where you can manage your attendance and view your records.</p>
				<p className='text-base'>Please navigate through the sidebar to access different features.</p>
			</div>
		</Container>
	);
}

export default Dashboard;
