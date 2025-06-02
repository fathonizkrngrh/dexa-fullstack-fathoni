export interface Employee {
  id: number;
  user_id: number;
  name: string;
  nik: string;
  position?: string;
  department?: string;
  status: string;
  phone_number?: string;
  address?: string;
  working_type?: string;
  join_date?: Date;
  deleted?: number;
  created_at?: Date;
  updated_at?: Date;
}
