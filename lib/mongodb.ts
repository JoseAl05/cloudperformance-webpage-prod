import { MongoClient, Db, Collection } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_USER_DB || 'appdb';

if (!uri) throw new Error('Missing MONGODB_URI');

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
  const c = await clientPromise!;
  return c.db(dbName);
}

export async function getCollection<T = unknown>(name: string): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}