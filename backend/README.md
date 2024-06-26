# Expense Tracker Backend

This is the backend application for the Expense Tracker project. The backend is built using Node.js, Express, and MongoDB. It provides RESTful APIs for user authentication, managing expenses, and managing categories.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Environment Variables](#environment-variables)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/expense_tracker.git
   cd expense_tracker/backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root of the `backend` directory and add the following variables:

   ```plaintext
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

## Usage

1. **Start the development server:**

   ```bash
   npm run dev
   ```

   This will start the server on `http://localhost:5000`.

## API Endpoints

### Auth

- **POST /api/auth/register**

  Register a new user.

  ```json
  {
    "username": "example",
    "password": "password123"
  }
  ```

- **POST /api/auth/login**

  Login an existing user.

  ```json
  {
    "username": "example",
    "password": "password123"
  }
  ```

### Expenses

- **GET /api/expenses**

  Get all expenses for the authenticated user.

- **POST /api/expenses**

  Add a new expense.

  ```json
  {
    "description": "Groceries",
    "amount": 50.0,
    "category": "Food",
    "date": "2024-06-01",
    "currency": "USD"
  }
  ```

- **DELETE /api/expenses/:id**

  Delete an expense by ID.

### Categories

- **GET /api/categories**

  Get all categories for the authenticated user.

- **POST /api/categories**

  Add a new category.

  ```json
  {
    "name": "Food"
  }
  ```

- **PUT /api/categories/:id**

  Edit a category by ID.

  ```json
  {
    "name": "Groceries"
  }
  ```

- **DELETE /api/categories/:id**

  Delete a category by ID.

## Features

- User authentication with JWT
- Manage expenses (add, edit, delete)
- Manage categories (add, edit, delete)
- Secure RESTful API

## Environment Variables

The following environment variables are used in this project:

- **PORT**: The port on which the server will run (default is 5000).
- **MONGODB_URI**: The connection string for the MongoDB database.
- **JWT_SECRET**: The secret key for signing JWT tokens.