import { CONFIG } from '@/config';
import Redis from 'ioredis';

const redisClient = new Redis({
  host: CONFIG.redis.host,
  port: CONFIG.redis.port,
  password: CONFIG.redis.password, // opsional
});

redisClient.on('connect', () => console.log('[Redis] Connected'));
redisClient.on('error', err => console.error('[Redis] Error', err));

export default redisClient;
