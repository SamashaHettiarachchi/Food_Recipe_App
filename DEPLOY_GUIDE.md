# Quick Deployment Guide

## Deploy Backend to Render (Free Tier)

1. Go to [render.com](https://render.com) and sign up/login
2. Connect your GitHub account
3. Create a new **Web Service**
4. Select this repository: `Food_Recipe_App`
5. Configure:
   - **Name**: `food-recipe-backend` (or any name)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

6. **Environment Variables** (add these in Render dashboard):
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   CLIENT_URL=https://food-recipe-app-mu-two.vercel.app
   NODE_ENV=production
   ```

7. Click **Create Web Service**
8. Copy the deployed URL (e.g., `https://food-recipe-backend.onrender.com`)
9. Update `frontend/food-blog-app/src/config.js` with the new URL
10. Redeploy frontend to Vercel

## Free MongoDB Setup (MongoDB Atlas)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free account and cluster (M0 tier)
3. Create database user with read/write permissions
4. Get connection string and use as `MONGO_URI`

## Environment Variables You Need

From your old Railway dashboard, copy these values:
- `MONGO_URI` - your MongoDB connection string
- `JWT_SECRET` - your JWT signing key
- `CLOUDINARY_CLOUD_NAME` - from Cloudinary dashboard
- `CLOUDINARY_API_KEY` - from Cloudinary dashboard  
- `CLOUDINARY_API_SECRET` - from Cloudinary dashboard

Set `CLIENT_URL=https://food-recipe-app-mu-two.vercel.app` (your Vercel frontend URL)
