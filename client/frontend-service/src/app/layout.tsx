import '@/styles/globals.css';
import { CustomProvider } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className='bg-gray-700 text-gray-900 antialiased min-h-screen'>
				<CustomProvider>{children}</CustomProvider>
			</body>
		</html>
	);
}
