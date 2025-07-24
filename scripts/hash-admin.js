import { hash, compare } from "bcrypt";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  "DB_USER",
  "DB_HOST",
  "DB_NAME",
  "DB_PASSWORD",
  "DB_PORT",
];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
}

// Connect to PostgreSQL
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
});

async function hashAdminPasswords() {
  await client.connect();

  const res = await client.query("SELECT id, password FROM admin_credits");

  for (const row of res.rows) {
    const { id, password } = row;

    // Skip if already hashed (bcrypt hashes start with $2)
    if (password.startsWith("$2")) {
      console.log(`⚠️ Password for admin ID ${id} already hashed. Skipping.`);
      continue;
    }

    const originalPassword = password;
    const hashed = await hash(password, 10);

    await client.query("UPDATE admin_credits SET password = $1 WHERE id = $2", [
      hashed,
      id,
    ]);

    // Verify the hash by comparing original password with hashed version
    const isValid = await compare(originalPassword, hashed);

    if (isValid) {
      console.log(`✅ Hashed and verified password for admin ID ${id}`);
    } else {
      console.log(`❌ Hash verification failed for admin ID ${id}`);
    }
  }

  await client.end();
}

hashAdminPasswords()
  .then(() => console.log("🔐 All passwords hashed successfully."))
  .catch((err) => {
    console.error("❌ Error hashing passwords:", err);
    client.end();
  });
