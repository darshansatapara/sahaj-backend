# Sahaj Backend

A Node.js backend API using Express and Neon SQL database.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Neon SQL database account

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your Neon database URL:
   ```
   DATABASE_URL=your_neon_database_url_here
   PORT=3000
   NODE_ENV=development
   ```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── models/        # Database models
├── routes/        # API routes
├── middleware/    # Custom middleware
└── server.js      # Main application file
```

## API Documentation

[Add API documentation here]

## Contributing

[Add contribution guidelines here] 