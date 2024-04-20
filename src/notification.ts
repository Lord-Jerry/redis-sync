import { subscriberRedis, destinationConnections } from "./connections";
import { syncQueue } from "./queue";

export default function () {
  subscriberRedis.config("SET", "notify-keyspace-events", "KEA");
  subscriberRedis.subscribe(
    "__keyevent@0__:set",
    "__keyevent@0__:del",
    (err, count) => {
      if (err) {
        console.error("Failed to subscribe:", err);
        return;
      }
      console.log(`Subscribed to ${count} channels.`);
    }
  );

  subscriberRedis.on("message", async (channel, message) => {
    console.log(`Received message from channel ${channel}: ${message}`);
    if (channel.includes("del")) {
      destinationConnections.forEach(async (connection) => {
        await connection.del(message);
      });
    } else {
      await syncQueue.add("sync", message);
    }
  });
}
