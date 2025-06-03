import redisClient from '@/database/redis';
import { StrokeStyle } from '@syncfusion/ej2-angular-diagrams';

const buildKey = (module: string, key: string) => `${module}:${key}`;

export const RedisUtil = {
  async get<T = unknown>(module: string, name: string, key: string): Promise<T | null> {
    const value = await redisClient.get(buildKey(`${module}:${name}`, key));
    return value ? (JSON.parse(value) as T) : null;
  },

  async set(module: string, name: string, key: string, data: unknown, ttlSeconds?: number): Promise<void> {
    const redisKey = buildKey(`${module}:${name}`, key);
    const value = JSON.stringify(data);

    if (ttlSeconds) {
      await redisClient.set(redisKey, value, 'EX', ttlSeconds);
    } else {
      await redisClient.set(redisKey, value);
    }
  },

  async del(module: string, name: string, key: string): Promise<number> {
    return await redisClient.del(buildKey(`${module}:${name}`, key));
  },

  async has(module: string, name: string, key: string): Promise<boolean> {
    const exists = await redisClient.exists(buildKey(`${module}:${name}`, key));
    return exists === 1;
  },
};
