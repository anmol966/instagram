import pg from "pg";
const { Pool } = pg;

// const pool = new Pool({
//   user: "postgres",
//   password: process.env.postgresPassword,
//   database: "instagram_database",
//   host: "localhost",
//   port: 5432,
// });

const pool = new Pool({
  connectionString:
    "postgres://anmolpanwar966:ZT8kaFOde7Lz@ep-yellow-shadow-87467895-pooler.us-east-2.aws.neon.tech/instagram_database",
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
