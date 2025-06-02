import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { User } from './types/user';

export function middleware(request: NextRequest) {
	const url = request.nextUrl;
	const path = url.pathname;

	const cookie = request.cookies.get('user')?.value;
	if (!cookie) {
		const loginUrl = new URL('/login?message=Please login to access this page.', request.url);
		return NextResponse.redirect(loginUrl);
	}

	const user = JSON.parse(cookie || '{}') as User;

	if (path.startsWith('/hr') && user.role !== 'ADMIN') {
		const loginUrl = new URL('/login?message=You are not authorized to access this page.', request.url);
		return NextResponse.redirect(loginUrl);
	}

	// if (path.startsWith('/employee') && user.role !== 'EMPLOYEE') {
	// 	const loginUrl = new URL('/login?message=You are not authorized to access this page.', request.url);
	// 	return NextResponse.redirect(loginUrl);
	// }

	return NextResponse.next();
}

export const config = {
	matcher: ['/hr/:path*', '/employee/:path*'],
};
