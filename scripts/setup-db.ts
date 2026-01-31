import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

// Load env vars manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
        }
    });
}
// Import turso AFTER setting env vars
const { turso } = require('../lib/turso');

async function main() {
    console.log('Checking database setup...');

    try {
        await turso.execute(`
            CREATE TABLE IF NOT EXISTS physics_scenes (
                id TEXT PRIMARY KEY,
                data TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Table "physics_scenes" is ready.');
    } catch (error) {
        console.error('❌ Error setting up database:', error);
    }
}

main();
