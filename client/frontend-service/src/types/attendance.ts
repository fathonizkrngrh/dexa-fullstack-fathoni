export type Attendance = {
	id: number;
	employee_id: number;
	type: string;
	status: 'CHECKIN' | 'CHECKOUT';
	date: string;
	time: string;
	photo_url: string | null;
	note: string | null;
	deleted: number;
	createdAt: string;
	updatedAt: string;
};

export type AttendanceGroup = {
	date: string;
	attendances: Attendance[];
};
