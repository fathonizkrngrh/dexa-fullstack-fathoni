'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Button, DatePicker, Form, IconButton, Input, InputGroup, InputPicker, Modal, Pagination, Panel, Schema, SelectPicker, Stack, Table, useToaster } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import PlusIcon from '@rsuite/icons/Plus';
import { formatDateOnly, getTodayWIB } from '@/lib/date';
import { SortType } from 'rsuite/esm/Table';
import type { FormInstance } from 'rsuite';
import { deleteEmployee, getEmployees, registerEmployee, updateEmployee } from '@/services/employeeService';
import AlertMessage from '@/components/ui/AlertMessage';
import { departmentData, positionData } from '@/lib/datas';
import { getEmployeeAttendance } from '@/services/attendanceService';
import Column from 'rsuite/esm/Table/TableColumn';
import { Cell, HeaderCell } from 'rsuite-table';
import { Employee } from '@/types/employee';

const mock = [
	{
		id: 8,
		name: 'superadmin',
		nik: '25060292',
		department: 'IT',
		position: 'Lead',
		user: {
			id: 9,
			role: 'EMPLOYEE',
			email: 'superadmin@example.com',
		},
		attendances: [],
	},
	{
		id: 6,
		name: 'Fathoni Zikri',
		nik: '25060219',
		department: 'Finance',
		position: 'Staff',
		user: {
			id: 7,
			role: 'EMPLOYEE',
			email: 'fathoni13@example.com',
		},
		attendances: [],
	},
	{
		id: 4,
		name: 'Ananda Nayswaa',
		nik: '25053191',
		department: 'IT',
		position: 'Staff',
		user: {
			id: 5,
			role: 'EMPLOYEE',
			email: 'ananda@example.com',
		},
		attendances: [],
	},
	{
		id: 2,
		name: 'Nugroho',
		nik: '25053032',
		department: 'IT',
		position: 'Supervisor',
		user: {
			id: 3,
			role: 'EMPLOYEE',
			email: 'fathoni@example.com',
		},
		attendances: [
			{
				id: 20,
				employee_id: 2,
				type: 'WFH',
				status: 'CHECKOUT',
				date: '2025-06-02',
				time: '23:14:01',
				photo_url: 'https://res.cloudinary.com/dlwncfs2u/image/upload/v1748880840/dexa/attendances/3-1748880838557.png',
				note: null,
				deleted: 0,
				createdAt: '2025-06-02T16:14:01.000Z',
				updatedAt: '2025-06-02T16:14:01.000Z',
			},
			{
				id: 19,
				employee_id: 2,
				type: 'WFH',
				status: 'CHECKIN',
				date: '2025-06-02',
				time: '23:08:18',
				photo_url: 'https://res.cloudinary.com/dlwncfs2u/image/upload/v1748880498/dexa/attendances/3-1748880496739.png',
				note: null,
				deleted: 0,
				createdAt: '2025-06-02T16:08:18.000Z',
				updatedAt: '2025-06-02T16:08:18.000Z',
			},
		],
	},
	{
		id: 1,
		name: 'HR Admin',
		nik: 'HR001',
		department: 'HR',
		position: 'Manager',
		user: {
			id: 1,
			role: 'ADMIN',
			email: 'hr.admin@example.com',
		},
		attendances: [],
	},
];

function Monitoring() {
	const [loading, setLoading] = useState(false);
	const [sortColumn, setSortColumn] = useState('name');
	const [sortType, setSortType] = useState<SortType>('asc');
	const [searchKeyword, setSearchKeyword] = useState('');
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const [department, setDepartment] = useState('');
	const [position, setPosition] = useState('');
  const [date, setDate] = useState(getTodayWIB());

	const [employeeData, setEmployeeData] = useState<Employee[] | []>([]);
	const [totalItems, setTotalItems] = useState(0);

	const [showModal, setShowModal] = useState(false);
	const [photo_url, setPhotoUrl] = useState<string | undefined>(undefined);

	const handleSortColumn = (sortColumn: string, sortType?: SortType) => {
		setSortColumn(sortColumn);
		setSortType(sortType ? sortType : 'asc');
	};

	const handleSetLimit = (limit: number) => {
		setLimit(limit);
		setPage(1);
	};

	useEffect(() => {
		APIGetAttendances();
	}, [sortType, sortColumn, searchKeyword, limit, page, department, position, date]);

	const APIGetAttendances = async () => {
		try {
			setLoading(true);
			const res = await getEmployeeAttendance({
				page: page - 1,
				size: limit,
				sortOrder: sortType,
				sortBy: sortColumn,
				search: searchKeyword,
				department: department,
				position: position,
				date: date,
			});
			setEmployeeData(res.data.items);
			setTotalItems(res.data.total_items);
			setLoading(false);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className='px-4 py-8'>
			<div className='mb-5'>
				<p className=' text-4xl font-bold'>Monitoring</p>
			</div>

			<Panel
				className='mb-4 '
				header={
					<Stack style={{ marginBottom: '10px', borderRadius: '4px 4px 0 0' }} justifyContent='flex-end'>
						<Stack spacing={6}>
							<SelectPicker
								label='Department'
								data={departmentData}
								searchable={false}
								cleanable={true}
								value={department}
								onChange={(value) => setDepartment(value ?? '')}
								className='mr-2'
							/>
							<SelectPicker label='Position' data={positionData} searchable={false} cleanable={true} value={position} onChange={(value) => setPosition(value ?? '')} className='mr-2' />
							<DatePicker
								label='Date'
                defaultChecked
								format='yyyy-MM-dd'
								value={date ? new Date(date) : null}
								onChange={(value) => setDate(value ? value.toISOString().slice(0, 10) : '')}
								cleanable
								oneTap
								style={{ minWidth: 160 }}
							/>
							<InputGroup inside>
								<Input placeholder='Search' value={searchKeyword} onChange={(value) => setSearchKeyword(value)} />
								<InputGroup.Addon role='button' tabIndex={0} onClick={() => APIGetAttendances()}>
									<SearchIcon />
								</InputGroup.Addon>
							</InputGroup>
						</Stack>
					</Stack>
				}
			>
				<Table
					shouldUpdateScroll={false}
					bordered={false}
					wordWrap='break-word'
					headerHeight={50}
					autoHeight
					sortType={sortType}
					sortColumn={sortColumn}
					onSortColumn={handleSortColumn}
					data={employeeData}
					loading={loading}
				>
					<Column flexGrow={1} fullText sortable>
						<HeaderCell>NIK</HeaderCell>
						<Cell dataKey='nik' />
					</Column>

					<Column flexGrow={1} fullText sortable>
						<HeaderCell>Name</HeaderCell>
						<Cell dataKey='name' />
					</Column>

					<Column flexGrow={1} fullText sortable>
						<HeaderCell>Position</HeaderCell>
						<Cell dataKey='position' />
					</Column>

					<Column flexGrow={1} fullText sortable>
						<HeaderCell>Department</HeaderCell>
						<Cell dataKey='department' />
					</Column>

					<Column flexGrow={2}>
						<HeaderCell>Check-in {date || 'Today'}</HeaderCell>
						<Cell>
							{(rowData: Employee) => {
								const checkin = rowData.attendances?.find((a) => a.status === 'CHECKIN');
								return checkin ? (
									<>
										<div className='flex items-center gap-2'>
											<img
												src={checkin.photo_url || undefined}
												alt='Check-in'

                        className="w-8 h-8 object-cover rounded-full cursor-pointer"												onClick={() => {
													setShowModal(true);
													setPhotoUrl(checkin.photo_url ?? undefined);
												}}
											/>
											<span>- {checkin.time}</span>
										</div>
									</>
								) : (
									'-'
								);
							}}
						</Cell>
					</Column>
					<Column flexGrow={2}>
						<HeaderCell>Check-out {date || 'Today'}</HeaderCell>
						<Cell>
							{(rowData: Employee) => {
								const checkout = rowData.attendances?.find((a) => a.status === 'CHECKOUT');
								return checkout ? (
									<>
                    <div className="flex items-center gap-2">
                      <img
                        src={checkout.photo_url || undefined}
                        alt="Check-out"
                        className="w-8 h-8 object-cover rounded-full cursor-pointer"
                        onClick={() => {
                          setShowModal(true);
                          setPhotoUrl(checkout.photo_url ?? undefined);
                        }}
                      />
                      <span>- {checkout.time}</span>
                    </div>
									</>
								) : (
									'-'
								);
							}}
						</Cell>
					</Column>
				</Table>
				<Pagination
					prev
					next
					first
					last
					ellipsis
					boundaryLinks
					maxButtons={5}
					size='xs'
					layout={['total', '-', 'limit', '|', 'pager', 'skip']}
					total={totalItems}
					limitOptions={[10, 30, 50]}
					limit={limit}
					activePage={page}
					onChangePage={setPage}
					onChangeLimit={handleSetLimit}
					className='mt-4'
				/>
			</Panel>

			<Modal open={showModal} onClose={() => setShowModal(false)} size='xs' backdrop='static'>
				<Modal.Body className='flex justify-center items-center'>
					<img src={photo_url || undefined} alt='Full Image' className='max-w-full max-h-[70vh]' />
				</Modal.Body>
        
        <Modal.Footer>
          <Button onClick={()=> setShowModal(false)} appearance="primary">
            Ok
          </Button>
        </Modal.Footer>
			</Modal>
		</div>
	);
}

export default Monitoring;
