import { MongoClient, Db, Collection } from "mongodb";

import { env } from "../config/env";
import { TaskDocument, GoalDocument } from "../types/task";

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

  const goalsCollection = database.collection<GoalDocument>("goals");
  await goalsCollection.createIndex({ id: 1 }, { unique: true });

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
