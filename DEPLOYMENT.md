# Free Deployment Guide

This guide will show you how to deploy this application for **free** with persistent data using MongoDB Atlas, Render, and Vercel.

## 1. Setup Proper Persistent Data (MongoDB Atlas)
By default, the app uses a local MongoDB database. To have proper data that is "always there" for free, use MongoDB Atlas.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up.
2. Create a free **M0 Cluster** (512MB of storage, totally free forever).
3. Under **Database Access**, create a new database user (e.g., username `admin`, and an auto-generated password). **Save the password**.
4. Under **Network Access**, click "Add IP Address" and allow access from anywhere (`0.0.0.0/0`).
5. Go to your **Databases**, click **Connect**, then **Connect your application**.
6. Copy the connection string. It will look like this: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`.
7. Replace `<password>` with the password you saved earlier. This is your `MONGODB_URI`.

## 2. Deploy the Backend (Render)
Render offers a great free tier for Node.js apps. The free tier spins down after inactivity but wakes up when a request hits it.

1. Create a free account on [Render](https://render.com/).
2. Push this entire project repository to your own GitHub.
3. In Render, click **New +** and select **Web Service**.
4. Connect your GitHub account and select this repository.
5. Configuration:
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Scroll down to **Environment Variables** and add:
   - `MONGODB_URI`: *paste your MongoDB Atlas connection string here*
   - `GEMINI_API_KEY`: *your gemini API key (optional)*
7. Click **Create Web Service**. Wait a few minutes for it to deploy.
8. Once live, copy the Render URL (e.g., `https://angular-questions-api.onrender.com`).

## 3. Deploy the Frontend (Vercel)
Vercel is arguably the best free platform for Vite/React frontends.

1. Create a free account on [Vercel](https://vercel.com/) and link your GitHub.
2. Click **Add New Project** and import the same repository.
3. Configuration:
   - **Root Directory**: Select `/client`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   - `VITE_API_URL`: *paste your Render backend URL followed by `/api`* (e.g., `https://angular-questions-api.onrender.com/api`)
5. Click **Deploy**.

## Testing the Application
Once both services are deployed, visit your Vercel URL. You can use the app seamlessly and all your questions, revisions, and notes will be securely stored in your personal MongoDB Atlas cluster!
