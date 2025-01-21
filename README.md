# Chat Application Project

This is a real-time chat application built using React (Frontend) and Express (Backend).

## Technology Stack

### Frontend
- React + TypeScript
- Tailwind CSS (Styling)
- shadcn/ui (UI Components)
- Axios (API Calls)
- React Router (Routing)
- React Query (State Management)

### Backend
- Express.js
- CORS (Cross-Origin Requests)
- PostgreSQL (Database)
- pg (PostgreSQL client)

## Project Structure

```
src/
├── pages/
│   └── Index.tsx (Main Chat Interface)
├── services/
│   └── api.ts (API Calls)
├── types/
│   └── db.ts (Type Definitions)
└── server.ts (Backend Server)
```

## Features

1. **Send and Receive Messages**
   - Users can type messages
   - Send messages using Enter key or Send button
   - Bot responds automatically

2. **UI Features**
   - Responsive Design
   - Loading States
   - Error Handling
   - Toast Notifications

## Database Schema

### Messages Table
```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    is_bot BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Endpoints

### GET /messages
- Retrieves all messages
- Response format:
```json
[
  {
    "id": "string",
    "content": "string",
    "isBot": boolean,
    "created_at": "Date"
  }
]
```

### POST /messages
- Saves a new message
- Request body:
```json
{
  "content": "string",
  "is_bot": boolean
}
```

## Setup and Running

1. **Database Setup:**
```bash
# Create database
createdb chat_app

# Run migrations
psql chat_app < schema.sql
```

2. **Environment Variables:**
Create a `.env` file with:
```
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=chat_app
DB_HOST=localhost
DB_PORT=5432
```

3. **Start Backend Server:**
```bash
node src/server.ts
```
Server will run on http://localhost:8080

4. **Start Frontend Development Server:**
```bash
npm run dev
```
Application will run on http://localhost:5173

## Error Handling

- Toast notifications for network errors
- Empty message validation
- Loading states displayed
- Database connection error handling

## Data Flow

1. User types a message
2. Frontend API service sends POST request
3. Backend stores the message in PostgreSQL
4. Bot response is generated
5. UI updates

## Notes

- PostgreSQL is used for persistent storage
- CORS is enabled for local development
- Console logs added for debugging
