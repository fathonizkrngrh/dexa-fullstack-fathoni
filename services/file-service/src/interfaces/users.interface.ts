export interface User {
  id: number;
  email: string;
  password: string;
  role: string;
  registered_by: number;
  deleted: number;
  created_at?: Date;
  updated_at?: Date;
}
