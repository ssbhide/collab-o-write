# Deployment Guide

This guide explains how to deploy the Collab-o-write application. We recommend using **Render** (render.com) as it supports both the Node.js backend and the React frontend easily, but you can use any similar providers (Vercel, Netlify, Railway, Heroku).

## Prerequisites

1.  **GitHub Repository**: Push this code to a GitHub repository.
2.  **MongoDB Atlas**: Create a free MongoDB cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
    *   Create a Cluster.
    *   Create a Database User (username/password).
    *   Allow access from anywhere (`0.0.0.0/0`) in Network Access.
    *   Get the Connection String (e.g., `mongodb+srv://<user>:<password>@cluster0.mongodb.net/collab-o-write`).

## 1. Deploy the Backend (Server)

1.  **Create New Web Service** on Render.
2.  **Connect GitHub**: Select your repository.
3.  **Settings**:
    *   **Root Directory**: `server`
    *   **Build Command**: `npm install && npm run build` (You may need to add a build script to `server/package.json` or just use `npm install`) -> *Actually, for this simple setup, `npm install` is fine if we run with `ts-node`.*
    *   **Start Command**: `npm start`
4.  **Environment Variables**:
    *   `MONGO_URI`: Your MongoDB Atlas connection string.
    *   `CLIENT_URL`: The URL of your frontend (you will get this in Step 2, for now you can put `*` or update it later).
    *   `PORT`: `3001` (Render usually sets a `PORT` env var automatically, our code respects it).

## 2. Deploy the Frontend (Client)

1.  **Create New Static Site** on Render (or Vercel/Netlify).
2.  **Connect GitHub**: Select your repository.
3.  **Settings**:
    *   **Root Directory**: `client`
    *   **Build Command**: `npm run build`
    *   **Publish Directory**: `dist`
4.  **Environment Variables**:
    *   `VITE_SERVER_URL`: The URL of your deployed Backend (from Step 1), e.g., `https://collab-o-write-server.onrender.com`.

## 3. Final Configuration

1.  Go back to your **Backend** deployment.
2.  Update the `CLIENT_URL` environment variable to match your new **Frontend** URL (e.g., `https://collab-o-write-client.onrender.com`).
3.  Redeploy the backend if necessary.

## Local Development vs Production

The code is now set up to automatically switch between local and production settings:

*   **Local**: Uses `.env` files (`localhost`).
*   **Production**: Uses the Environment Variables you set in the dashboard.
