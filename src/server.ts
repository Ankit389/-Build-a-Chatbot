import express from 'express';
import cors from 'cors';
import { DBMessage } from './types/db';

const app = express();
app.use(cors());
app.use(express.json());

let messages: DBMessage[] = [];

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.post('/messages', (req, res) => {
  const { content, is_bot } = req.body;
  const newMessage: DBMessage = {
    id: Date.now().toString(),
    content,
    isBot: is_bot,
    created_at: new Date()
  };
  messages.push(newMessage);
  res.json(newMessage);
});

app.listen(8080, () => {
  console.log('Server running on port 8080');
});