import { AUTH_API } from '@/lib/axios';
import { removeCookie, setCookie } from '@/lib/cookies';
import { NextResponse } from 'next/server';

export const login = async (email: string, password: string) => {
	try {
		const response = await AUTH_API.post('/login', {
			email,
			password,
		});

		const data = response.data.data;
		if (data && typeof window !== 'undefined') {
			localStorage.setItem('token', data.token);
			localStorage.setItem('employee', JSON.stringify(data.employee));
			setCookie('token', data.token)
			setCookie('user', JSON.stringify(data.user));
		}

		const res = NextResponse.json({ success: true });

		res.cookies.set('user', JSON.stringify(data.user), {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 60 * 60 * 24,
		});

		res.cookies.set('token', data.token, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 60 * 60 * 24,
		});

		return response.data;
	} catch (error: any) {
		throw error?.response?.data || error;
	}
};

export const logout = async () => {
	if (typeof window !== 'undefined') {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		removeCookie('token');
		removeCookie('user');
	}

	const res = NextResponse.json({ success: true });

	res.cookies.set('token', '', {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/',
		maxAge: 0, 
	});

	res.cookies.set('user', '', {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/',
		maxAge: 0,
	});

	return res;
};
