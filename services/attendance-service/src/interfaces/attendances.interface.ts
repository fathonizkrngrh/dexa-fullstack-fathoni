export interface Attendance {
  id: number;
  employee_id: number;
  type: string;
  status: string;
  date: Date;
  time: string;
  photo_url?: string;
  note?: string;
  deleted?: number;
  created_at?: Date;
  updated_at?: Date;
}
