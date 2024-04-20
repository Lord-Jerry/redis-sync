import Redis from "ioredis";
import { syncQueue } from "./queue";
import { handlerKeyMap } from "./datatypes";
import { sourceRedis } from "./connections";

const MAX_KEYS = 100;

async function scanKeys(cursor: string): Promise<[string, string[]]> {
  return sourceRedis.scan(cursor, "MATCH", "*", "COUNT", MAX_KEYS);
}

export async function getRedisKeyvalue(connection: Redis, keys: string[]) {
  const pipeline = connection.pipeline();
  for (let key of keys) {
    const type = await sourceRedis.type(key);
    const fn = handlerKeyMap[type as keyof typeof handlerKeyMap];
    if (!fn) {
      throw new Error(`Unhandled type for key ${key}: ${type}`);
    }

    await fn(pipeline, key);
  }
  await pipeline.exec();
}

export async function scanAndSyncRedisKeys() {
  let cursor: string | null = "0";
  do {
    const [position, keys] = await scanKeys(cursor);
    console.log(`Scanning keys at position ${position}`);
    if (keys.length === 0) cursor = null;

    console.log(`Syncing ${keys.length} keys`);

    await syncQueue.addBulk(keys.map((key) => ({ name: "sync", data: key })));
    cursor = position;
  } while (cursor !== "0");
}
