import axios from 'axios';
import type { DBMessage } from '@/types/db';

const API_URL = 'http://localhost:8080';

export const apiService = {
  async getMessages(): Promise<DBMessage[]> {
    try {
      console.log('Fetching messages from:', `${API_URL}/messages`);
      const response = await axios.get(`${API_URL}/messages`);
      console.log('Messages received from backend:', response.data);
      return response.data.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        isBot: msg.is_bot,
        created_at: new Date(msg.created_at)
      }));
    } catch (error) {
      console.error('Error in getMessages:', error);
      return [];
    }
  },

  async saveMessage(content: string, isBot: boolean): Promise<DBMessage> {
    try {
      console.log('Sending message to backend:', { content, isBot });
      const response = await axios.post(`${API_URL}/messages`, {
        content,
        is_bot: isBot
      });
      console.log('Response from backend:', response.data);
      return {
        id: response.data.id,
        content: response.data.content,
        isBot: response.data.is_bot,
        created_at: new Date(response.data.created_at)
      };
    } catch (error) {
      console.error('Error in saveMessage:', error);
      return {
        id: Date.now().toString(),
        content,
        isBot,
        created_at: new Date()
      };
    }
  }
};