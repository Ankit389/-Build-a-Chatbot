// import { Pool } from 'pg';

// // PostgreSQL connection configuration
// const pool = new Pool({
//   user: 'ankit',             // आपका PostgreSQL यूजरनेम
//   host: 'localhost',         // डेटाबेस होस्ट
//   database: 'chatbot_db',    // डेटाबेस का नाम
//   password: 'Ankit@111',     // आपका PostgreSQL पासवर्ड
//   port: 5432,               // डिफ़ॉल्ट पोर्ट
// });

// // Message interface
// export interface DBMessage {
//   id: string;
//   content: string;
//   isBot: boolean;
//   created_at: Date;
// }

// // Database service
// export const dbService = {
//   async initializeDB() {
//     try {
//       // Create table if it doesn't exist
//       await pool.query(`
//         CREATE TABLE IF NOT EXISTS messages (
//           id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//           content TEXT NOT NULL,
//           is_bot BOOLEAN NOT NULL,
//           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         );
//       `);
//       console.log('Database initialized successfully');
//     } catch (error) {
//       console.error('Error initializing database:', error);
//       throw error;
//     }
//   },

//   async saveMessage(content: string, isBot: boolean): Promise<DBMessage> {
//     try {
//       const result = await pool.query(
//         'INSERT INTO messages (content, is_bot) VALUES ($1, $2) RETURNING *',
//         [content, isBot]
//       );
      
//       const message = result.rows[0];
//       console.log('Message saved successfully:', message);
      
//       return {
//         id: message.id,
//         content: message.content,
//         isBot: message.is_bot,
//         created_at: new Date(message.created_at)
//       };
//     } catch (error) {
//       console.error('Error saving message:', error);
//       throw error;
//     }
//   },

//   async getMessages(): Promise<DBMessage[]> {
//     try {
//       const result = await pool.query(
//         'SELECT * FROM messages ORDER BY created_at ASC'
//       );
      
//       console.log('Retrieved messages:', result.rows);
      
//       return result.rows.map(msg => ({
//         id: msg.id,
//         content: msg.content,
//         isBot: msg.is_bot,
//         created_at: new Date(msg.created_at)
//       }));
//     } catch (error) {
//       console.error('Error getting messages:', error);
//       throw error;
//     }
//   }
// };


import { Pool } from 'pg';

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres',          // अपना PostgreSQL यूजरनेम
  host: 'localhost',         // डेटाबेस होस्ट
  database: 'chatbot_db',    // डेटाबेस का नाम
  password: 'your_password', // अपना PostgreSQL पासवर्ड
  port: 5432,               // डिफ़ॉल्ट PostgreSQL पोर्ट
});

// Messages table queries
export const dbService = {
  async getMessages() {
    const query = 'SELECT * FROM messages ORDER BY created_at ASC';
    const result = await pool.query(query);
    return result.rows;
  },

  async saveMessage(content: string, isBot: boolean) {
    const query = `
      INSERT INTO messages (content, is_bot, created_at)
      VALUES ($1, $2, NOW())
      RETURNING *
    `;
    const values = [content, isBot];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
};