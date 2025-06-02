import Cookies from 'js-cookie';

export const setCookie = (name: string, value: string, options?: Cookies.CookieAttributes) => {
	Cookies.set(name, value, {
		path: '/', // tambahkan ini
		expires: 7,
		secure: true,
		sameSite: 'strict',
		...options,
	});
};

export const getCookie = (name: string): string | undefined => {
	return Cookies.get(name);
};

export const removeCookie = (name: string, options?: Cookies.CookieAttributes) => {
	Cookies.remove(name, options);
};
