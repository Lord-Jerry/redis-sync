import { Queue } from "bullmq";

export const syncQueue = new Queue("syncQueue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});
