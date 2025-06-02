'use client';
import { Button, Nav, Navbar } from 'rsuite';
import Brand from '../ui/Sidebar/Brand';
import Icon from '@rsuite/icons/esm/Icon';
import { MdLogout, MdPeople } from 'react-icons/md';
import Image from 'next/image';

export default function NavBar({ logout }: { logout?: () => void }) {
	return (
		<Navbar appearance='subtle'>
			<Navbar.Brand href='#'>
				<Image alt='logo' src='/logo.png' width={100} height={50} />
			</Navbar.Brand>
			<Nav pullRight>
				<Nav.Item  as={Button} onClick={logout} icon={<Icon as={MdLogout} />}>Logout</Nav.Item>
			</Nav>
		</Navbar>
	);
}
