'use client';
import { Form, Button, Panel, Input, Stack, VStack, InputGroup, Schema, useToaster, Message } from 'rsuite';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { forwardRef, useEffect, useRef, useState } from 'react';
import TextField from '@/components/forms/TextField';
import { login } from '@/services/authService';
import { useRouter, useSearchParams } from 'next/navigation';
import AlertMessage from '@/components/ui/AlertMessage';
import type { Ref } from 'react';

type PasswordProps = React.ComponentProps<typeof InputGroup>;

const Password = forwardRef<HTMLDivElement, PasswordProps & { value?: string; onChange?: (value: string) => void }>((props, ref: Ref<HTMLDivElement>) => {
	const [visible, setVisible] = useState(false);
	const { value, onChange, ...rest } = props;

	const handleChange = () => {
		setVisible(!visible);
	};
	return (
		<InputGroup inside ref={ref} {...rest}>
			<Input type={visible ? 'text' : 'password'} value={value} onChange={onChange} autoComplete='off' />
			<InputGroup.Button onClick={handleChange}>{visible ? <FaRegEye /> : <FaRegEyeSlash />}</InputGroup.Button>
		</InputGroup>
	);
});
Password.displayName = 'Password';

const { StringType } = Schema.Types;

const model = Schema.Model({
	email: StringType().isEmail('Format email tidak valid.').isRequired('Email wajib diisi.'),
	password: StringType().isRequired('Password wajib diisi.'),
});

function LoginPage() {
	const toaster = useToaster();
	const router = useRouter();
	const formRef = useRef<any>(null);
	const [formValue, setFormValue] = useState({
		email: '',
		password: '',
	});
	const [message, setMessage] = useState<string>('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const msg = params.get('message') || '';
		setMessage(msg);
	}, []);

	useEffect(() => {
		if (message) {
			toaster.push(AlertMessage('error', decodeURIComponent(message)), { placement: 'topCenter', duration: 2000 });
		}
	}, [message]);

	const handleSubmit = async () => {
		if (!formRef.current.check()) {
			return;
		}

		setLoading(true);
		try {
			const { data } = await login(formValue.email, formValue.password);
			console.log('Login response:', data);
			toaster.push(AlertMessage('success', 'Login berhasil!'), { placement: 'topCenter', duration: 2000 });
			if (data.user.role === 'ADMIN') {
				console.log('Redirecting to admin dashboard');
				router.push('/hr/dashboard');
			} else if (data.user.role === 'EMPLOYEE') {
				router.push('/employee/presence');
			}
		} catch (err: any) {
			toaster.push(AlertMessage('error', err.message), { placement: 'topCenter', duration: 2000 });
		} finally {
			setLoading(false);
		}
	};

	return (
		<Stack alignItems='center' justifyContent='center'>
			<Panel bordered className='bg-white shadow-lg w-md'>
				<h2 className='text-center text-xl font-bold pb-8'>Sign In</h2>
				<Form fluid ref={formRef} model={model} formValue={formValue} onChange={(formValue) => setFormValue(formValue as { email: string; password: string })} onSubmit={handleSubmit}>
					<TextField name='email' label='Email Address' />
					<TextField name='password' label='Password' autoComplete='off' accepter={Password} />
					<VStack spacing={10}>
						<Button type='submit' appearance='primary' loading={loading} block>
							Sign In
						</Button>
					</VStack>
				</Form>
			</Panel>
		</Stack>
	);
}

export default LoginPage;
