import "dotenv/config";
import Redis from "ioredis";

const source = process.env.REDIS_SOURCE;
const destinations = process.env.REDIS_DESTINATIONS;

if (!source) {
  throw new Error("REDIS_SOURCE is not defined");
}

if (!destinations) {
  throw new Error("REDIS_DESTINATIONS is not defined");
}

const sourceRedis = new Redis(source);
const subscriberRedis = new Redis(source);
const destinationConnections: Redis[] = [];

destinations.split(";").forEach((destination) => {
  destinationConnections.push(new Redis(destination.trim()));
});

export { sourceRedis, subscriberRedis, destinationConnections };
