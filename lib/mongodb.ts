// import { MongoClient, Db, Collection } from 'mongodb';

// const uri = process.env.MONGODB_URI!;
// const dbName = process.env.MONGODB_USER_DB || 'appdb';

// if (!uri) throw new Error('Missing MONGODB_URI');

// let client: MongoClient | null = null;
// let clientPromise: Promise<MongoClient> | null = null;

// declare global {
//   var _mongoClientPromise: Promise<MongoClient> | undefined;
// }

// if (process.env.NODE_ENV === 'development') {
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri);
//     global._mongoClientPromise = client.connect();
//   }
//   clientPromise = global._mongoClientPromise;
// } else {
//   client = new MongoClient(uri);
//   clientPromise = client.connect();
// }

// export async function getDb(): Promise<Db> {
//   const c = await clientPromise!;
//   return c.db(dbName);
// }

// export async function getCollection<T = unknown>(name: string): Promise<Collection<T>> {
//   const db = await getDb();
//   return db.collection<T>(name);
// }

import { MongoClient, Db, Collection } from 'mongodb';

let clientPromise: Promise<MongoClient> | null = null;

function getClientPromise(): Promise<MongoClient> {
  if (clientPromise) return clientPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI');

  const client = new MongoClient(uri);

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    clientPromise = client.connect();
  }

  return clientPromise;
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export async function getDb(): Promise<Db> {
  const c = await getClientPromise();
  const dbName = process.env.MONGODB_USER_DB || 'appdb';
  return c.db(dbName);
}

export async function getCollection<T = unknown>(
  name: string,
): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}
