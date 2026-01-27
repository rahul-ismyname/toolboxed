import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

export const turso = createClient({
    url: url || '',
    authToken: authToken || '',
});

// Helper for generating UUID-like strings in SQLite if needed
export const generateId = () => crypto.randomUUID();
