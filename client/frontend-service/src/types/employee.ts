import { Attendance } from "./attendance";
import { User } from "./user";

export type Employee = {
    id: number;
    user_id: number;
    name: string;
    nik: string;
    position: string;
    department: string;
    status: string;
    phone_number: string;
    address: string;
    join_date: string;
    working_type: string;
    deleted: number;
    created_at: string;
    updated_at: string;
    attendances?: Attendance[];
    user: User;
};