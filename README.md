# Angular Interview Questions App (React & Express)

This project is a full-stack application for managing and viewing Angular interview questions. Despite the name, the frontend is built using **React** (with Vite) and the backend is an **Express & MongoDB** REST API.

## Project Structure

- `client/`: React frontend application built with Vite and Tailwind CSS.
- `server/`: Node.js Express backend API, powered by MongoDB and offering Google Generative AI integration for answer generation.
- `docker-compose.yml`: Docker configuration to easily spin up a local MongoDB instance.

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- Docker (optional, for running MongoDB via `docker-compose`)
- MongoDB (if not using Docker, ensure you have a local instance running)

## How to Run the Project

### 1. Start the Database

The easiest way to start the MongoDB database is using Docker Compose. From the root directory:

```bash
docker-compose up -d
```

This will start a MongoDB container named `angular-mongo-db` running on port 27017.

### 2. Setup and Run the Server

Navigate to the `server` directory:
```bash
cd server
```

Install the dependencies:
```bash
npm install
```

**(Optional) Environment Variables**:
You can create a `.env` file in the `server` directory and configure the following variables:
- `PORT=5000` (default)
- `GEMINI_API_KEY=your_google_gemini_api_key` (Required for generating AI answers in the admin portal)

Seed the database with initial data (optional but recommended):
```bash
npm run seed
```

Start the backend server:
```bash
npm start
```
The server will run on `http://localhost:5000`.

### 3. Setup and Run the Client

Open a new terminal and navigate to the `client` directory:
```bash
cd client
```

Install the dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```

The application will typically be available at `http://localhost:5173`.

## Features
- **User Authentication**: Register and login functionalities.
- **Progress Tracking**: Track which questions you have reviewed or saved for revision.
- **Interactions**: Like and mark questions as asked.
- **Notes**: Add personal notes to specific interview questions.
- **AI Integration**: Admin role can generate answers for new questions using Google's Gemini AI.

## Deployment

Looking to host this application online for free? Check out the [Free Deployment Guide](./DEPLOYMENT.md) for step-by-step instructions on setting up MongoDB Atlas, Render, and Vercel.
