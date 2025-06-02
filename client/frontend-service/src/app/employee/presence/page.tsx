'use client';
import AlertMessage from '@/components/ui/AlertMessage';
import { getCookie } from '@/lib/cookies';
import { createAttendance, getMyAttendance } from '@/services/attendanceService';
import { deleteFile, uploadFile } from '@/services/fileService';
import { AttendanceGroup } from '@/types/attendance';
import { Employee } from '@/types/employee';
import { User } from '@/types/user';
import React, { useEffect, useMemo, useState } from 'react';
import { MdPerson } from 'react-icons/md';
import { Button, Loader, Modal, Uploader, useToaster } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

function previewFile(file: File, callback: (dataUrl: string | ArrayBuffer | null) => void) {
	const reader = new FileReader();
	reader.onloadend = () => {
		callback(reader.result);
	};
	reader.readAsDataURL(file);
}

function Presence() {
	const [myAttendanceData, setMyAttendanceData] = useState<AttendanceGroup[]>([]);
	const [showModal, setShowModal] = useState(false);
	const [photo, setPhoto] = useState<File | null>(null);

	const toaster = useToaster();
	const [uploading, setUploading] = React.useState(false);
	const [fileInfo, setFileInfo] = React.useState<string | ArrayBuffer | null>(null);
	const [showAllAttendance, setShowAllAttendance] = useState(false);

	const today = new Date();
	const dayName = today.toLocaleDateString('id-ID', { weekday: 'long' });
	const dateStr = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

	const todayStr = new Date().toISOString().slice(0, 10);
	const todayAttendance = useMemo(() => myAttendanceData.find((item) => item.date === todayStr), [myAttendanceData, todayStr]);

	const checkin = todayAttendance?.attendances.find((att) => att.status === 'CHECKIN');
	const checkout = todayAttendance?.attendances.find((att) => att.status === 'CHECKOUT');

	const [employee, setEmployee] = useState<Employee | undefined>();
	useEffect(() => {
		const localEmp = localStorage.getItem('employee') ? (JSON.parse(localStorage.getItem('employee') as string) as Employee) : undefined;
		setEmployee(localEmp);
	}, []);

	useEffect(() => {
		APIGetMyAttendance();
	}, []);

	const handleCreateAttendance = async () => {
		if (!photo) return;
		try {
			const formData = new FormData();
			formData.append('file', photo);

			setUploading(true);

			const uploadRes = await uploadFile({
				foldername: 'dexa/attendances',
				file: photo,
			});
			const { url, public_id } = uploadRes.data;

			try {
				await createAttendance({ photo_url: url });

				toaster.push(AlertMessage('success', 'Success saving attendance!'), { placement: 'topCenter', duration: 2000 });
				APIGetMyAttendance();
			} catch (err: any) {
				await deleteFile({ public_id });
				toaster.push(AlertMessage('error', err.message), { placement: 'topCenter', duration: 2000 });
			} finally {
				setUploading(false);
				setShowModal(false);
				setPhoto(null);
				setFileInfo(null);
			}
		} catch (err: any) {
			toaster.push(AlertMessage('error', err.message), { placement: 'topCenter', duration: 2000 });
		} finally {
			setShowModal(false);
			setPhoto(null);
			setFileInfo(null);
			setUploading(false);
		}
	};

	const APIGetMyAttendance = async () => {
		try {
			const res = await getMyAttendance({
				date_from: '',
				date_to: '',
			});
			setMyAttendanceData(res.data);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className='mt-6 bg-white rounded-xl shadow-lg flex flex-col'>
			<div className='flex items-start px-6 py-4 border-b border-slate-200'>
				<div className='flex-1 text-lg font-semibold'>{employee?.name || '-'}</div>
				<div className='flex flex-col items-end'>
					<div className='text-sm text-slate-700'>{employee?.position || '-'}</div>
					<div className='text-xs text-slate-400'>{employee?.department || '-'}</div>
				</div>
			</div>

			<div className='text-center border-b border-slate-200 px-6 py-4'>
				<h4 className='text-lg font-semibold'>{dayName}</h4>
				<p className='text-slate-500'>{dateStr}</p>
			</div>

			<div className='flex px-6 py-4 gap-4'>
				<div className='flex-1 flex flex-col items-center rounded-lg p-3'>
					<div className='text-sm text-slate-500 mb-4'>Start Time</div>
					<div className='flex items-center gap-6'>
						<img
							src={checkin?.photo_url || '/avatar-start.jpg'}
							alt='Start Thumbnail'
							className={`
                w-8 h-8 rounded-full object-cover border
                ${checkin ? '' : 'slatescale bg-slate-200'}
              `}
							style={!checkin ? { filter: 'slatescale(1)', backgroundColor: '#e5e7eb' } : {}}
						/>
						<span className='text-xl font-bold'>{checkin ? checkin.time : '--'}</span>
					</div>
				</div>
				<div className='flex flex-col justify-center'>
					<div className='h-16 border-l border-slate-200 mx-2'></div>
				</div>
				<div className='flex-1 flex flex-col items-center rounded-lg p-3'>
					<div className='text-sm text-slate-500 mb-4'>End Time</div>
					<div className='flex items-center gap-6'>
						<img
							src={checkout?.photo_url || '/avatar-end.jpg'}
							alt='End Thumbnail'
							className={`
                w-8 h-8 rounded-full object-cover border
                ${checkout ? '' : 'slatescale bg-slate-200'}
              `}
							style={!checkout ? { filter: 'slatescale(1)', backgroundColor: '#e5e7eb' } : {}}
						/>
						<span className='text-xl font-bold'>{checkout ? checkout.time : '--'}</span>
					</div>
				</div>
			</div>

			<div className='px-6 py-4'>
				<Button appearance='primary' block onClick={() => setShowModal(true)}>
					Record / Presence
				</Button>
			</div>

			<div className='px-6 py-4 border-b border-slate-200'>
				<div className='font-semibold mb-2'>Recent Attendance</div>
				{myAttendanceData.length === 0 ? (
					<div className='text-center text-slate-400 font-bold py-4'>No Records</div>
				) : (
					<ul className='divide-y divide-slate-200'>
						{(showAllAttendance ? myAttendanceData : myAttendanceData.slice(0, 2)).map((item, idx) =>
							item.attendances.map((att, attIdx) => (
								<li key={`${idx}-${attIdx}-${att.status}`} className='py-2 flex items-center text-sm gap-3'>
									<img
										src={att.photo_url || (att.status === 'CHECKIN' ? '/avatar-start.jpg' : '/avatar-end.jpg')}
										alt={att.status === 'CHECKIN' ? 'Start' : 'End'}
										className='w-10 h-10 rounded-full object-cover border'
									/>
									<div className='flex-1 flex flex-col'>
										<div className='font-semibold'>{`${new Date(item.date).toLocaleDateString('id-ID', { weekday: 'long' })}, ${item.date}`}</div>
										<div className='text-xs text-slate-700 mt-1'>{att.time}</div>
									</div>
									<div className={`ml-4 font-semibold ${att.status === 'CHECKIN' ? 'text-green-600' : 'text-blue-600'}`}>{att.status === 'CHECKIN' ? 'Start' : 'End'}</div>
								</li>
							))
						)}
					</ul>
				)}
				<Button appearance='link' block className='mt-2 p-0 ' onClick={() => setShowAllAttendance((prev) => !prev)}>
					{showAllAttendance ? 'View Less' : 'View More'}
				</Button>
			</div>

			<Modal open={showModal} onClose={() => setShowModal(false)} size='xs'>
				<Modal.Header>
					<Modal.Title>Upload Presence Photo</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Uploader
						action=''
						fileListVisible={false}
						onChange={(fileList) => {
							const file = fileList?.[0]?.blobFile as File | undefined;
							setPhoto(file || null);
							if (file) {
								previewFile(file, (dataUrl) => {
									setFileInfo(dataUrl);
								});
							}
						}}
						autoUpload={false}
						accept='image/*'
						draggable
						listType='picture'
						multiple={false}
					>
						<button style={{ width: 300, height: 150, display: 'flex', border: '1px dashed #ddd', borderRadius: 8, overflow: 'hidden' }}>
							{uploading && <Loader backdrop center />}
							{typeof fileInfo === 'string' ? (
								<img src={fileInfo} alt='preview' style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
							) : (
								<MdPerson style={{ fontSize: 80, color: '#999' }} />
							)}
						</button>
						{/* <button style={{ width: 350, height: 150, display: 'flex' }}>
							<MdPerson style={{ fontSize: 80, display: 'block', margin: '0 auto' }} />
						</button> */}
					</Uploader>
				</Modal.Body>
				<Modal.Footer>
					<Button
						appearance='primary'
						onClick={() => {
							confirm('Are you sure you want to save this attendance?') && handleCreateAttendance();
						}}
						disabled={!photo}
					>
						Save Attendance
					</Button>
					<Button
						onClick={() => {
							setShowModal(false);
							setPhoto(null);
							setFileInfo(null);
						}}
						appearance='subtle'
					>
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

export default Presence;
