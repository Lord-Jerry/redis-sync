import { ChainableCommander } from "ioredis";
import { sourceRedis } from "./connections";

export async function handleString(
  connection: ChainableCommander,
  key: string
) {
  const [ttl, value] = await Promise.all([
    sourceRedis.ttl(key),
    sourceRedis.get(key),
  ]);

  if (value === null) return;
  connection.set(key, value);
  if (ttl > 0) connection.expire(key, ttl);
}

export async function handleList(connection: ChainableCommander, key: string) {
  const [ttl, list] = await Promise.all([
    sourceRedis.ttl(key),
    sourceRedis.lrange(key, 0, -1),
  ]);

  if (list.length === 0) return;
  connection.rpush(key, ...list);
  if (ttl > 0) connection.expire(key, ttl);
}

export async function handleSet(connection: ChainableCommander, key: string) {
  const [ttl, set] = await Promise.all([
    sourceRedis.ttl(key),
    sourceRedis.smembers(key),
  ]);

  if (set.length === 0) return;
  connection.sadd(key, ...set);
  if (ttl > 0) connection.expire(key, ttl);
}

export async function handleZset(connection: ChainableCommander, key: string) {
  const [ttl, zset] = await Promise.all([
    sourceRedis.ttl(key),
    sourceRedis.zrange(key, 0, -1, "WITHSCORES"),
  ]);

  if (zset.length === 0) return;
  const zaddArgs: string[] = [];
  for (let i = 0; i < zset.length; i += 2) {
    zaddArgs.push(zset[i + 1], zset[i]); // Score is second, member is first
  }
  connection.zadd(key, ...zaddArgs);
  if (ttl > 0) connection.expire(key, ttl);
}

export async function handleHash(connection: ChainableCommander, key: string) {
  const [ttl, hash] = await Promise.all([
    sourceRedis.ttl(key),
    sourceRedis.hgetall(key),
  ]);

  if (Object.keys(hash).length === 0) return;
  connection.hmset(key, hash);
  if (ttl > 0) connection.expire(key, ttl);
}

export const handlerKeyMap = {
  string: handleString,
  list: handleList,
  set: handleSet,
  zset: handleZset,
  hash: handleHash,
  none: handleString,
} as const;
