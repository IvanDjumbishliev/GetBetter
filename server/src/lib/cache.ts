import Redis from 'ioredis';
import { env } from '../config/env';

const TTL_SECONDS = 5 * 60;
let client: Redis | undefined;

function getClient(): Redis | undefined {
  if (!env.REDIS_URL) return undefined;

  client ??= new Redis(env.REDIS_URL, {
    lazyConnect: true,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
    retryStrategy: (attempt) => Math.min(attempt * 100, 2_000),
  });
  return client;
}

export async function getCacheVersion(key: string): Promise<string> {
  const redis = getClient();
  if (!redis) return '0';

  try {
    return (await redis.get(key)) ?? '0';
  } catch (error) {
    console.error(`Redis cache version read failed for "${key}":`, error);
    return '0';
  }
}

export async function getCached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const redis = getClient();
  if (!redis) return load();

  try {
    const cached = await redis.get(key);
    if (cached !== null) return JSON.parse(cached) as T;
  } catch (error) {
    console.error(`Redis cache read failed for "${key}":`, error);
  }

  const result = await load();
  try {
    await redis.set(key, JSON.stringify(result), 'EX', TTL_SECONDS);
  } catch (error) {
    console.error(`Redis cache write failed for "${key}":`, error);
  }
  return result;
}

export async function invalidateCacheVersion(key: string): Promise<void> {
  const redis = getClient();
  if (!redis) return;

  try {
    await redis.incr(key);
  } catch (error) {
    console.error(`Redis cache invalidation failed for "${key}":`, error);
  }
}
