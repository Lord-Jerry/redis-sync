# Redis Sync

## Introduction
Redis Sync is an open-source tool designed to synchronize data across two or more Redis instances. It ensures that changes in one instance are reflected in others, keeping them in sync seamlessly.

## Why Redis Sync Instead of Redis Dump and Restore?
Redis Sync was developed to address specific challenges that arise when using traditional Redis dump and restore methods, such as those implemented by tools like RAMP. One of the main issues with the dump and restore approach is its lack of compatibility with older Redis versions. When trying to sync or migrate data to a Redis instance that is of a lower version than the source, these methods often fail because they do not support backward compatibility.

## Features
- Easy synchronization of multiple Redis instances.
- Support for dynamic addition of Redis destinations.
- Docker compatibility for easy deployment.

## Prerequisites
Before you begin, ensure you have the following installed:
- [Bun](https://bun.sh/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Installation

### Step 1: Clone the repository
Clone the Redis Sync repository to your local machine:
```bash
git clone https://github.com/yourusername/redis-sync.git
cd redis-sync
```

### Step 2: Install dependencies
Use Bun to install the necessary dependencies:
```bash
bun install
```

### Step 3: Set up environment variables
Create a `.env` file in the project root to store environment variables:
```bash
touch .env
```
Add the following environment variables to the `.env` file:
```
REDIS_SOURCE="redis://source_redis_host:source_redis_port"
REDIS_DESTINATIONS="redis://dest_redis_host1:dest_redis_port1;redis://dest_redis_host2:dest_redis_port2"
```
Here, `REDIS_SOURCE` is the Redis instance from which data will be synced, and `REDIS_DESTINATIONS` includes one or more Redis instances to sync data to, separated by semicolons (`;`).

### Step 4: Deploy with Docker Compose
Start the Redis instances using Docker Compose:
```bash
docker-compose up -d redis1
```

### Step 5: Start Redis Sync
Run the Redis Sync service:
```bash
bun run ./index.ts
```

## Usage
Once you've set up Redis Sync, it will continuously synchronize data from the source Redis instance to the specified destination instances. Make sure the Redis instances specified in `REDIS_DESTINATIONS` are accessible and properly configured to receive data.

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests to improve the functionality of Redis Sync.
