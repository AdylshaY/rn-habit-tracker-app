import { Account, Client, Databases } from 'react-native-appwrite';

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!);

const account = new Account(client);

const databases = new Databases(client);

const DATABASE_ID = process.env.EXPO_PUBLIC_DB_ID!;
const HABITS_TABLE_NAME = process.env.EXPO_PUBLIC_HABITS_TABLE_NAME!;

interface RealTimeResponse {
  events: string[];
  payload: any;
}

export { account, client, DATABASE_ID, databases, HABITS_TABLE_NAME, RealTimeResponse };

