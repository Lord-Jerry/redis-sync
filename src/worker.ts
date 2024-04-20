import { Worker } from "bullmq";
import { getRedisKeyvalue } from "./scan";
import { destinationConnections } from "./connections";

export default function () {
  const _ = new Worker(
    "syncQueue",
    async (job) => {
      console.log(`Processing job ${job.id}`);
      await Promise.all(
        destinationConnections.map((connection) =>
          getRedisKeyvalue(connection, [job.data])
        )
      ).catch((err) => {
        console.error(`Failed to sync key ${job.data}: ${err}`);
        throw err;
      });

      console.log(`completed Processing job ${job.id}`);

      return job.data;
    },
    {
      connection: {
        host: "localhost",
        port: 6379,
      },
      concurrency: 100,
      removeOnComplete: { count: 0 },
    }
  );
}
