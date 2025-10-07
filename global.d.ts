import { Mongoose } from 'mongoose';

// Define the shape of the cached mongoose object
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}
