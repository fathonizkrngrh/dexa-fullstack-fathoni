import bcrypt from 'bcrypt';

/**
 * Meng-hash password dengan saltRounds = 10
 * @param plainPassword string
 * @returns hashed password
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return await bcrypt.hash(plainPassword, 10);
}

/**
 * Membandingkan plain dan hashed password
 * @param plainPassword string
 * @param hashedPassword string
 * @returns boolean
 */
export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Generate default password tourist
 * @param name string
 * @param birthDate string
 * @returns boolean
 */
export async function generatePassword(name: string, key: string): Promise<string> {
  const nameParts = name.trim().split(' ');
  const lastName = nameParts[nameParts.length - 1];

  return `${lastName}${key}`.toLowerCase();
}
