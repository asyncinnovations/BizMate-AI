"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.pool = void 0;
const pg_1 = require("pg");
require("dotenv/config");
exports.pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});
const connectDB = async () => {
    try {
        const client = await exports.pool.connect();
        console.log("✔ Connected to PostgreSQL");
        client.release();
    }
    catch (err) {
        console.error("❌ Database connection error:", err);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map