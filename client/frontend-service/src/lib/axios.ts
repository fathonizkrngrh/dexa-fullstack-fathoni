import axios, { AxiosInstance } from 'axios';
import { getCookie, setCookie } from './cookies';
import CONFIG from './config';

const applyInterceptor = (instance: AxiosInstance) => {
	instance.interceptors.request.use(
		(config) => {
			if (typeof window !== 'undefined') {
				const cacheToken = getCookie('token');
				if (cacheToken) {
					config.headers.Authorization = `Bearer ${cacheToken}`;
					localStorage.setItem('token', cacheToken);
				} else {
					const token = localStorage.getItem('token');
					if (token) {
						setCookie('token', token);
						config.headers.Authorization = `Bearer ${token}`;
					}
				}
			}
			return config;
		},
		(error) => Promise.reject(error)
	);
};

export const createAPI = (baseURL: string) => {
	const instance = axios.create({ baseURL });
	applyInterceptor(instance);
	return instance;
};

// Contoh penggunaan:
export const AUTH_API = createAPI(CONFIG.AUTH_SERVICE_URL);
export const ATTENDANCE_API = createAPI(CONFIG.ATTENDANCE_SERVICE_URL);
export const EMPLOYEE_API = createAPI(CONFIG.EMPLOYEE_SERVICE_URL);
export const FILE_API = createAPI(CONFIG.FILE_SERVICE_URL);
