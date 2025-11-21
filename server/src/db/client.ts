import { MongoClient, Db, Collection } from "mongodb";

import { env } from "../config/env";
import { TaskDocument, GoalDocument } from "../types/task";
import { UserDocument } from "../types/user";

let client: MongoClient | null = null;
let database: Db | null = null;

export const connectToDatabase = async () => {
  if (database) {
    return database;
  }

  client = new MongoClient(env.mongoUri);
  await client.connect();
  database = client.db(env.mongoDbName);

  const tasksCollection = database.collection<TaskDocument>("tasks");
  await tasksCollection.createIndex({ id: 1 }, { unique: true });
  await tasksCollection.createIndex({ userId: 1 });

  const goalsCollection = database.collection<GoalDocument>("goals");
  await goalsCollection.createIndex({ id: 1 }, { unique: true });
  await goalsCollection.createIndex({ userId: 1 });

  const usersCollection = database.collection<UserDocument>("users");
  await usersCollection.createIndex({ id: 1 }, { unique: true });
  await usersCollection.createIndex({ email: 1 }, { unique: true });

  return database;
};

export const getTasksCollection = async (): Promise<
  Collection<TaskDocument>
> => {
  const db = await connectToDatabase();
  return db.collection<TaskDocument>("tasks");
};

export const getGoalsCollection = async (): Promise<
  Collection<GoalDocument>
> => {
  const db = await connectToDatabase();
  return db.collection<GoalDocument>("goals");
};

export const getUsersCollection = async (): Promise<
  Collection<UserDocument>
> => {
  const db = await connectToDatabase();
  return db.collection<UserDocument>("users");
};
