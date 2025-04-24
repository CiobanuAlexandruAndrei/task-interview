# Task Interview Backend

This is the Express.js backend API for the task interview project.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory and add your environment variables (see `.env.example`).

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`.

## Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with hot reload
- `npm test`: Run tests

## API Endpoints

- `GET /api/health`: Health check endpoint
- More endpoints coming soon...

## Project Structure

```
src/
├── index.js          # Main application entry
├── routes/           # API routes
├── controllers/      # Route controllers
├── models/          # Data models
├── middleware/      # Custom middleware
└── utils/           # Utility functions
``` 