'use client';
import React, { useState } from 'react';
import { Sidebar, Sidenav, Nav, Button } from 'rsuite';
import Brand from '../ui/Sidebar/Brand';
import { MdDashboard, MdGroup, MdSettings, MdOutlineStackedBarChart, MdLogout } from 'react-icons/md';
import Icon from '@rsuite/icons/esm/Icon';
import { IconType } from 'react-icons/lib';
import { NavToggle } from '../ui/Sidebar/NavToggle';

export type SidebarItem = {
	icon?: IconType;
	label: string;
	href?: string;
	items?: SidebarItem[]; // for submenu
};

type SidebarLayoutProps = {
	activeKey?: string;
	onSelect?: (eventKey: string) => void;
	expand?: boolean;
	logout?: () => void;
};

const sidebarData: SidebarItem[] = [
	{
		icon: MdDashboard,
		label: 'Dashboard',
		href: '/hr/dashboard',
	},
	{
		icon: MdGroup,
		label: 'Employee',
		href: '/hr/employee',
	},
	{
		icon: MdOutlineStackedBarChart,
		label: 'Monitoring',
		href: '/hr/monitoring',
	},
	{
		icon: MdSettings,
		label: 'Config',
		href: '/hr/config',
	},
];

export default function SidebarLayout({ activeKey, onSelect, expand: expandProp, logout }: SidebarLayoutProps) {
	const [expand, setExpand] = useState(expandProp ?? true);

	const renderNavItems = (items: SidebarItem[], parentPath = '') =>
		items.map((item) => {
			const path = item.href || parentPath + '/' + item.label.toLowerCase();
			if (item.items && item.items.length > 0) {
				return (
					<Nav.Menu key={path} eventKey={path} title={item.label} icon={<Icon as={item.icon || MdDashboard} />} placement='rightStart'>
						{renderNavItems(item.items, path)}
					</Nav.Menu>
				);
			}
			return (
				<Nav.Item key={item.href} eventKey={item.href} icon={<Icon as={item.icon || MdDashboard} />} href={item.href}>
					{item.label}
				</Nav.Item>
			);
		});

	return (
		<Sidebar className=' bg-slate-50 h-screen' width={expand ? 260 : 56} collapsible>
			<Sidenav.Header>
				<Brand expand={expand} />
			</Sidenav.Header>
			<Sidenav expanded={expand} appearance='subtle'>
				<Sidenav.Body>
					<Nav activeKey={activeKey} onSelect={onSelect}>
						{renderNavItems(sidebarData)}
					</Nav>
					<Nav>
						<Nav.Item key='logout' onClick={logout} icon={<Icon as={MdLogout} />}>
							Logout
						</Nav.Item>
					</Nav>
				</Sidenav.Body>
			</Sidenav>
			<NavToggle expand={expand} onChange={() => setExpand(!expand)} />
		</Sidebar>
	);
}
