# Node.js REST API

A learning project demonstrating REST API development with Node.js, Express, TypeScript, and MongoDB.

## Features

- 🔐 JWT Authentication
- 🛡️ TypeScript for type safety
- 🗄️ MongoDB with Mongoose
- 🚦 Express middleware
- ⚡ Async/Await
- 🎯 Error handling
- 🔍 Request validation
- 📝 Environment configuration
- 🧪 API testing ready

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- Express Validator
- Bcrypt

## Project Structure

```
src/
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/         # Mongoose models
├── routes/         # API routes
├── types/          # TypeScript types
├── utils/          # Utility functions
└── server.ts       # App entry point
```

## API Endpoints

### Authentication

```
POST /auth/register
POST /auth/login
POST /auth/logout
```

### Products

```
GET    /api/products
POST   /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id
```

## Getting Started

1. Clone the repository

```bash
git clone <repository-url>
```

2. Install dependencies

```bash
npm install
```

4. Start the development server

```bash
npm start
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

1. Register a new user:

```bash
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

2. Login:

```bash
POST /auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

3. Use the returned token in subsequent requests:

```bash
Authorization: Bearer <your-token>
```

## Error Handling

The API uses a centralized error handling mechanism:

## Middleware

- `isAuthenticated`: JWT token verification
- `validateRequest`: Request validation
- `errorHandler`: Global error handling

## Postman Collection

- [Postman Collection](https://limewire.com/d/ROAoa#iNKM9PQvZs)
