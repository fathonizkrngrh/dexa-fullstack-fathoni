
import { AUTH_API, EMPLOYEE_API } from '@/lib/axios';
import { SortType } from 'rsuite/esm/Table';

export interface GetEmployeesParams {
  sortBy?: string;
  sortOrder?: SortType;
  page?: number;
  size?: number;
  department?: string;
  position?: string;
  search?: string;
}

export const getEmployees = async (params: GetEmployeesParams = {}) => {
  try {
    const response = await EMPLOYEE_API.get('/employee', {
      params: {
        sortBy: params.sortBy ?? 'created_at',
        sortOrder: params.sortOrder ?? 'ASC',
        page: params.page ?? 0,
        size: params.size ?? 10,
        department: params.department ?? '',
        position: params.position ?? '',
        search: params.search ?? '',
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch employees:', error);
    throw error?.response?.data || error;
  }
};

interface RegisterEmployeePayload {
  email: string;
  role: 'EMPLOYEE' | 'ADMIN' ;
  name: string;
  position: string;
  department: string;
  phone_number: string;
  address: string;
  working_type: string; 
}

export const registerEmployee = async (payload: RegisterEmployeePayload) => {
  try {
    const response = await AUTH_API.post('/register/employee', {...payload, registered_by: 1});
    return response;
  } catch (error: any) {
    console.error('Failed to register employee:', error);
    throw error?.response?.data || error;
  }
};

export const deleteEmployee = async (id: number) => {
  try {
    const response = await EMPLOYEE_API.delete(`/employee/${id}`);
    return response;
  } catch (error: any) {
    console.error('Failed to delete employee:', error);
    throw error?.response?.data || error;
  }
};

interface UpdateEmployeePayload {
  name?: string;
  position?: string;
  department?: string;
  phone_number?: string;
  address?: string;
  status?: string;
}

export const updateEmployee = async (id: number, payload: UpdateEmployeePayload) => {
  try {
    const response = await EMPLOYEE_API.put(`/employee/${id}`, payload);
    return response;
  } catch (error: any) {
    console.error('Failed to update employee:', error);
    throw error?.response?.data || error;
  }
};