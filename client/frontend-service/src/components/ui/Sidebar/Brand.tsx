import React from 'react';
import { HStack, Text } from 'rsuite';
import { FaReact } from 'react-icons/fa';
import Image from 'next/image';

interface BrandProps {
	expand: boolean;
}

function Brand({ expand }: BrandProps) {
	return (
		<HStack
			className={`px-3.5 py-4 text-xl flex text-white bg-slate-200 items-center justify-center`}
			spacing={12}
		>
			<Image
				alt='logo'
				src='/logo.png'
				width={100}
				height={50}
				// className={expand ? '' : 'w-full h-auto'}
			/>
		</HStack>
	);
}

export default Brand;
