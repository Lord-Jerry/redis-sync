import worker from "./src/worker";
import notification from "./src/notification";
import { scanAndSyncRedisKeys } from "./src/scan";

scanAndSyncRedisKeys();
worker();
notification();
