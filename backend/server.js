const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: "ankit",
  host: "localhost",
  database: "chatbot_db",
  password: "Ankit@111",
  port: 5432,
});

// Initialize database
async function initializeDB() {
  let client;
  try {
    client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content TEXT NOT NULL,
        is_bot BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Initialize DB when server starts
initializeDB().catch(console.error);

// Get all messages
app.get("/api/messages", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM messages ORDER BY created_at ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ error: "Failed to get messages" });
  }
});

// Save new message
app.post("/api/messages", async (req, res) => {
  const { content, isBot } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO messages (content, is_bot) VALUES ($1, $2) RETURNING *",
      [content, isBot]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Failed to save message" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
