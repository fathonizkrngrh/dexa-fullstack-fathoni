import { ATTENDANCE_API } from '@/lib/axios';
import { GetEmployeesParams } from './employeeService';

export interface GetMyAttendanceParams {
	date_from?: string;
	date_to?: string;
}

export const getMyAttendance = async (params: GetMyAttendanceParams = {}) => {
	try {
		const response = await ATTENDANCE_API.get('/attendance/me', {
			params: {
				date_from: params.date_from ?? '',
				date_to: params.date_to ?? '',
			},
		});

		return response.data;
	} catch (error: any) {
		console.error('Failed to fetch my attendance:', error);
		throw error?.response?.data || error;
	}
};

export interface CreateAttendanceParams {
	photo_url: string;
}

export const createAttendance = async (params: CreateAttendanceParams) => {
	try {
		const response = await ATTENDANCE_API.post('/attendance', {
			photo_url: params.photo_url,
		});
		return response.data;
	} catch (error: any) {
		console.error('Failed to create attendance:', error);
		throw error?.response?.data || error;
	}
};

export interface GetEmployeeAttendanceParams {
	date: string;
}

export const getEmployeeAttendance = async (params: GetEmployeeAttendanceParams & GetEmployeesParams) => {
	try {
		const response = await ATTENDANCE_API.get('/attendance/employee', {
			params: params,
		});
		return response.data;
	} catch (error: any) {
		console.error('Failed to fetch employee attendance:', error);
		throw error?.response?.data || error;
	}
};
