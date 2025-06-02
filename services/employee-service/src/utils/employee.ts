/**
 * Generate NIK Karyawan minimal 8 digit.
 * Format: YYMMDD + random 2 digit (00-99)
 * @param joinDate string in 'YYYY-MM-DD' format
 * @returns string NIK
 */
export function generateEmployeeNIK(joinDate: string): string {
  const date = new Date(joinDate);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid join date format');
  }

  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const dd = String(date.getDate()).padStart(2, '0');

  const randomDigits = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, '0');

  const nik = `${yy}${mm}${dd}${randomDigits}`;
  return nik;
}
