import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from './db/schemas';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'BugBoard',
    password: 'root',
    port: 5432,
});

pool.connect().then(() => {
    console.log('Connesso al DB');
}).catch(err => {
    throw { code: 500, message: "connect ECONNREFUSED" }
});

export const database = drizzle(pool, { schema })