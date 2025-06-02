'use client';
// import Table, { TableColumn } from '@/components/ui/Table/Table';
import { Employee } from '@/types/employee';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, IconButton, Input, InputGroup, InputPicker, Modal, Pagination, Panel, Schema, SelectPicker, Stack, Table, useToaster } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import PlusIcon from '@rsuite/icons/Plus';
import { formatDateOnly } from '@/lib/date';
import { SortType } from 'rsuite/esm/Table';
import type { FormInstance } from 'rsuite';
import { deleteEmployee, getEmployees, registerEmployee, updateEmployee } from '@/services/employeeService';
import AlertMessage from '@/components/ui/AlertMessage';
import { departmentData, positionData, roleData, workingTypeData } from '@/lib/datas';

const { Column, HeaderCell, Cell, ColumnGroup } = Table;

const { StringType } = Schema.Types;

const Model = Schema.Model({
	name: StringType().isRequired('Name is required'),
	position: StringType().isRequired('Position is required'),
	department: StringType().isRequired('Department is required'),
	phone_number: StringType().isRequired('Phone number is required'),
	address: StringType().isRequired('Address is required'),
	working_type: StringType().isRequired('Working type is required'),
	email: StringType().isEmail('Please enter a valid email').isRequired('Email is required'),
	role: StringType().isRequired('Role is required'),
});

type EmployeeForm = {
	id?: string;
	name: string;
	position: string;
	department: string;
	phone_number: string;
	address: string;
	working_type: string;
	email?: string;
	role: string;
};


function EmployeePage() {
	const emptyForm: EmployeeForm = {
		name: '',
		position: '',
		department: '',
		phone_number: '',
		address: '',
		working_type: '',
		email: '',
		role: '',
	};

	const [formValue, setFormValue] = useState(emptyForm);
	const [formEditValue, setFormEditValue] = useState(emptyForm);

	const [showAddModal, setShowAddModal] = useState(false);
	const [uploadLoader, setUploadLoader] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [loading, setLoading] = useState(false);

	const [sortColumn, setSortColumn] = useState('name');
	const [sortType, setSortType] = useState<SortType>('asc');
	const [searchKeyword, setSearchKeyword] = useState('');
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const [department, setDepartment] = useState('');
	const [position, setPosition] = useState('');

	const [employeeData, setEmployeeData] = useState<Employee[] | []>([]);
	const [totalItems, setTotalItems] = useState(0);

	const formRef = useRef<FormInstance>(null);
	const formEditRef = useRef<FormInstance>(null);
	const toaster = useToaster();

	useEffect(() => {
		APIGetEmployees();
	}, [sortType, sortColumn, searchKeyword, limit, page, department, position]);

	const APIGetEmployees = async () => {
		try {
			setLoading(true);
			const res = await getEmployees({
				page: page - 1,
				size: limit,
				sortOrder: sortType,
				sortBy: sortColumn,
				search: searchKeyword,
				department: department,
				position: position,
			});
			setEmployeeData(res.data.items);
			setTotalItems(res.data.total_items);
			setLoading(false);
		} catch (err) {
			console.error(err);
		}
	};

	const handleSortColumn = (sortColumn: string, sortType?: SortType) => {
		setSortColumn(sortColumn);
		setSortType(sortType ? sortType : 'asc');
	};

	const handleSetLimit = (limit: number) => {
		setLimit(limit);
		setPage(1);
	};

	const handleSubmit = (apiFunction: any) => {
		if (formRef.current && formRef.current.check()) {
			console.log(formValue);
			apiFunction(formValue);
		}
	};

	const handleSubmitEdit = (apiFunction: any) => {
		console.log('formEditValue', formEditValue);
		if (formEditRef.current && formEditRef.current.check()) {
			console.log('masuk');
			console.log(formEditValue);
			const id = formEditValue.id;
			apiFunction(id, formEditValue);
		}
	};

	const handleOpenEditModal = (id: string) => {
		const selected = employeeData.find((data) => String(data.id) === String(id));
		if (!selected) return;
		setFormEditValue({
			id: String(selected.id),
			name: selected.name,
			position: selected.position,
			department: selected.department,
			phone_number: selected.phone_number,
			address: selected.address,
			email: selected.user.email,
			working_type: selected.working_type,
			role: selected.user.role,
		});
		setShowEditModal(true);
	};

	const APIRegisterEmployee = async (formData: any) => {
		console.log('formdata', formData);
		try {
			const result = await registerEmployee(formData);
			console.log(result);
			if (result.status === 201) {
				setShowAddModal(false);
				setFormValue(emptyForm);
				APIGetEmployees();

				toaster.push(AlertMessage('success', 'Success registering employee!'), { placement: 'topCenter', duration: 2000 });
			} else if (result.status === 400) {
				toaster.push(AlertMessage('error', 'Failed to register employee'), { placement: 'topCenter', duration: 2000 });
			}
		} catch (error: any) {
			toaster.push(AlertMessage('error', error?.message), { placement: 'topCenter', duration: 2000 });
		}
	};

	const APIDeleteEmployee = async (id: number) => {
		try {
			const result = await deleteEmployee(id);
			if (result.status === 200) {
				APIGetEmployees();

				toaster.push(AlertMessage('success', `Success delete employee ${id}`), {
					placement: 'topCenter',
					duration: 2000,
				});
			} else if (result.status === 400) {
				toaster.push(AlertMessage('error', `Error: "${result.data.message}". Please try again later!`), {
					placement: 'topCenter',
					duration: 2000,
				});
			}
		} catch (error: any) {
			toaster.push(AlertMessage('error', error?.message), { placement: 'topCenter', duration: 2000 });
		}
	};

	const APIUpdateEmployee = async (id: number, data: EmployeeForm) => {
		setUploadLoader(true);
		try {
			const result = await updateEmployee(id, data);
			if (result.status === 200) {
				setShowEditModal(false);
				setFormEditValue(emptyForm);
				APIGetEmployees();
				toaster.push(AlertMessage('success', 'Success updating employee!'), { placement: 'topCenter', duration: 2000 });
			} else {
				toaster.push(AlertMessage('error', 'Failed to update employee'), { placement: 'topCenter', duration: 2000 });
			}
		} catch (error: any) {
			toaster.push(AlertMessage('error', error.message), { placement: 'topCenter', duration: 2000 });
		} finally {
			setUploadLoader(false);
		}
	};

	return (
		<div className='px-4 py-8'>
			<div className='mb-5'>
				<p className=' text-4xl font-bold'>Employee</p>
			</div>

			<Panel
				className='mb-4 '
				header={
					<Stack style={{ marginBottom: '10px', borderRadius: '4px 4px 0 0' }} justifyContent='space-between'>
						<IconButton icon={<PlusIcon />} appearance='primary' color='blue' onClick={() => setShowAddModal(true)}>
							Add Employee
						</IconButton>

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

							<InputGroup inside>
								<Input placeholder='Search' value={searchKeyword} onChange={(value) => setSearchKeyword(value)} />
								<InputGroup.Addon role='button' tabIndex={0} onClick={() => APIGetEmployees()}>
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

					<Column flexGrow={1} fullText sortable>
						<HeaderCell>Working Type</HeaderCell>
						<Cell dataKey='working_type' />
					</Column>

					<Column flexGrow={1} fullText>
						<HeaderCell>Phone</HeaderCell>
						<Cell dataKey='phone_number' />
					</Column>

					<Column flexGrow={1} fullText>
						<HeaderCell>Address</HeaderCell>
						<Cell dataKey='address' />
					</Column>

					<Column flexGrow={1} fullText sortable>
						<HeaderCell>Join Date</HeaderCell>
						<Cell>{(rowData: Employee) => formatDateOnly(rowData.join_date)}</Cell>
					</Column>

					<Column flexGrow={1} fullText>
						<HeaderCell>Email</HeaderCell>
						<Cell>{(rowData: Employee) => rowData.user.email}</Cell>
					</Column>

					<Column flexGrow={1} fullText>
						<HeaderCell>Role</HeaderCell>
						<Cell>{(rowData: Employee) => rowData.user.role}</Cell>
					</Column>

					<Column flexGrow={1}>
						<HeaderCell>Action</HeaderCell>
						<Cell>
							{(rowData: Employee) => (
								<Stack spacing={2} direction='row' justifyContent='center'>
									<Button appearance='link' size='sm' color='blue' onClick={() => handleOpenEditModal(String(rowData.id))}>
										Edit
									</Button>
									<Button
										appearance='link'
										color='red'
										size='sm'
										onClick={async () => {
											const options = { okButtonText: 'Yes', cancelButtonText: 'Cancel' };
											const result = await confirm(`Are you sure want to delete patient ${rowData.name} ?`);

											if (result) await APIDeleteEmployee(rowData.id);
										}}
									>
										Delete
									</Button>
								</Stack>
							)}
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
			{/* add modal */}
			<Modal
				backdrop='static'
				open={showAddModal}
				onClose={() => {
					setShowAddModal(false);
					setFormValue(emptyForm);
				}}
				overflow={true}
				size='md'
			>
				<Modal.Header>
					<Modal.Title>Add Treatment Record</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form ref={formRef} model={Model} className='p-2' fluid onChange={(formValue) => setFormValue(formValue as EmployeeForm)} formValue={formValue}>
						<div className='flex flex-col md:flex-row gap-6'>
							<div className='flex-1 space-y-4'>
								<Form.Group controlId='name'>
									<Form.ControlLabel>Name</Form.ControlLabel>
									<Form.Control name='name' />
								</Form.Group>
								<Form.Group controlId='email'>
									<Form.ControlLabel>Email</Form.ControlLabel>
									<Form.Control name='email' />
								</Form.Group>
								<Form.Group controlId='position'>
									<Form.ControlLabel>Position</Form.ControlLabel>
									<Form.Control name='position' accepter={InputPicker} data={positionData} placeholder='Select position' className='w-full' />
								</Form.Group>
								<Form.Group controlId='department'>
									<Form.ControlLabel>Department</Form.ControlLabel>
									<Form.Control name='department' className='w-full' accepter={InputPicker} data={departmentData} placeholder='Select department' />
								</Form.Group>
							</div>
							<div className='flex-1 space-y-4'>
								<Form.Group controlId='address'>
									<Form.ControlLabel>Address</Form.ControlLabel>
									<Form.Control name='address' />
								</Form.Group>
								<Form.Group controlId='phone_number'>
									<Form.ControlLabel>Phone Number</Form.ControlLabel>
									<Form.Control name='phone_number' />
								</Form.Group>
								<Form.Group controlId='working_type'>
									<Form.ControlLabel>Working Type</Form.ControlLabel>
									<Form.Control name='working_type' className='w-full' accepter={InputPicker} data={workingTypeData} placeholder='Select working type' />
								</Form.Group>
								<Form.Group controlId='role'>
									<Form.ControlLabel>Role</Form.ControlLabel>
									<Form.Control name='role' className='w-full' accepter={InputPicker} data={roleData} placeholder='Select role' />
								</Form.Group>
							</div>
						</div>
					</Form>
				</Modal.Body>
				<Modal.Footer className='mt-4'>
					<Button
						onClick={() => {
							setShowAddModal(false);
							setFormValue(emptyForm);
						}}
						appearance='subtle'
					>
						Cancel
					</Button>
					<Button
						onClick={() => {
							handleSubmit(APIRegisterEmployee);
						}}
						appearance='primary'
						color='green'
						type='submit'
					>
						Add
					</Button>
				</Modal.Footer>
			</Modal>

			{/* edit modal */}
			<Modal
				backdrop='static'
				open={showEditModal}
				onClose={() => {
					setShowEditModal(false);
					setFormEditValue(emptyForm);
				}}
				overflow={true}
				size='md'
			>
				<Modal.Header>
					<Modal.Title>Edit Employee</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form ref={formEditRef} model={Model} className='p-2' fluid onChange={(formValue) => setFormEditValue(formValue as EmployeeForm)} formValue={formEditValue}>
						<div className='flex flex-col md:flex-row gap-6'>
							<div className='flex-1 space-y-4'>
								<Form.Group controlId='name'>
									<Form.ControlLabel>Name</Form.ControlLabel>
									<Form.Control name='name' />
								</Form.Group>
								<Form.Group controlId='position'>
									<Form.ControlLabel>Position</Form.ControlLabel>
									<Form.Control name='position' accepter={InputPicker} data={positionData} placeholder='Select position' className='w-full' />
								</Form.Group>
								<Form.Group controlId='working_type'>
									<Form.ControlLabel>Working Type</Form.ControlLabel>
									<Form.Control name='working_type' className='w-full' accepter={InputPicker} data={workingTypeData} placeholder='Select working type' />
								</Form.Group>
								<Form.Group controlId='department'>
									<Form.ControlLabel>Department</Form.ControlLabel>
									<Form.Control name='department' className='w-full' accepter={InputPicker} data={departmentData} placeholder='Select department' />
								</Form.Group>
							</div>
							<div className='flex-1 space-y-4'>
								<Form.Group controlId='email' hidden>
									<Form.ControlLabel>Email</Form.ControlLabel>
									<Form.Control name='email' />
								</Form.Group>
								<Form.Group controlId='address'>
									<Form.ControlLabel>Address</Form.ControlLabel>
									<Form.Control name='address' />
								</Form.Group>
								<Form.Group controlId='phone_number'>
									<Form.ControlLabel>Phone Number</Form.ControlLabel>
									<Form.Control name='phone_number' />
								</Form.Group>
								<Form.Group controlId='role'>
									<Form.ControlLabel>Role</Form.ControlLabel>
									<Form.Control name='role' className='w-full' accepter={InputPicker} data={roleData} placeholder='Select role' disabled />
								</Form.Group>
							</div>
						</div>
					</Form>
				</Modal.Body>
				<Modal.Footer className='mt-4'>
					<Button
						onClick={() => {
							setShowEditModal(false);
							setFormEditValue(emptyForm);
						}}
						appearance='subtle'
						disabled={uploadLoader}
					>
						Cancel
					</Button>
					<Button
						onClick={() => {
							handleSubmitEdit(APIUpdateEmployee);
						}}
						appearance='primary'
						color='green'
						type='submit'
						loading={uploadLoader}
					>
						Save
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

export default EmployeePage;
