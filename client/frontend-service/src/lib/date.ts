export function formatDate(timestamp: string | number | Date) {
	const date = new Date(timestamp);
	const day = date.getUTCDate().toString().padStart(2, '0');
	const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
	const year = date.getUTCFullYear();
	const hours = date.getUTCHours().toString().padStart(2, '0');
	const minutes = date.getUTCMinutes().toString().padStart(2, '0');
	const seconds = date.getUTCSeconds().toString().padStart(2, '0');

	return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

export function formatDateOnly(timestamp: string | number | Date) {
	const date = new Date(timestamp);
	const day = date.getUTCDate().toString().padStart(2, '0');
	const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
	const year = date.getUTCFullYear();

	return `${day}-${month}-${year}`;
}

export function formatDateString(yyyymm: string) {
	const [year, month] = yyyymm.split('-');
	const date = new Date(Number(year), Number(month) - 1);

	const monthName = date.toLocaleString('default', { month: 'long' });

	return `${monthName} ${year}`;
}

export const getTodayWIB = () => {
	const now = new Date();
	// Convert to WIB (UTC+7)
	const wibOffset = 7 * 60; // minutes
	const localOffset = now.getTimezoneOffset(); // minutes
	const wibTime = new Date(now.getTime() + (wibOffset + localOffset) * 60 * 1000);
	return wibTime.toISOString().slice(0, 10);
};
