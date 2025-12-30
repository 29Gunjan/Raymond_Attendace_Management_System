# 🚀 Railway Deployment Guide

## Raymond Attendance Management System - Railway Deployment

This guide will help you deploy the attendance management system on Railway.com.

---

## Prerequisites

1. A [Railway.com](https://railway.com) account (GitHub login recommended)
2. Your code pushed to GitHub repository
3. A payment method added to Railway (free tier available)

---

## Step-by-Step Deployment

### Step 1: Create a New Project on Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Connect your GitHub account if not already connected
5. Select your repository: `29Gunjan/Raymond_Attendace_Management_System`

---

### Step 2: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically create a PostgreSQL instance
4. Click on the PostgreSQL service to see connection details
5. Note: Railway automatically provides `DATABASE_URL` variable

---

### Step 3: Deploy Backend Service

1. In your Railway project, click **"+ New"** → **"GitHub Repo"**
2. Select your repository again
3. **Important:** Configure the service:
   - Click on the service card
   - Go to **"Settings"** tab
   - Set **"Root Directory"** to: `backend`
   - Set **"Watch Paths"** to: `/backend/**`

4. Go to **"Variables"** tab and add:

```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=8h
CORS_ORIGIN=https://your-frontend-url.up.railway.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

5. **Link PostgreSQL:** 
   - Click **"+ Variable"** → **"Add Reference"**
   - Select your PostgreSQL service
   - This automatically adds `DATABASE_URL`

6. Go to **"Settings"** → **"Networking"**
   - Click **"Generate Domain"** to get a public URL
   - Note this URL (e.g., `your-backend.up.railway.app`)

---

### Step 4: Deploy Frontend Service

1. Click **"+ New"** → **"GitHub Repo"**
2. Select your repository again
3. Configure the service:
   - Go to **"Settings"** tab
   - Set **"Root Directory"** to: `frontend`
   - Set **"Watch Paths"** to: `/frontend/**`

4. Go to **"Variables"** tab and add:

```
VITE_API_URL=https://your-backend.up.railway.app/api
```
   
   *(Replace `your-backend.up.railway.app` with your actual backend URL from Step 3)*

5. Go to **"Settings"** → **"Networking"**
   - Click **"Generate Domain"** to get a public URL

---

### Step 5: Update Backend CORS

After you get the frontend URL, go back to your **Backend service**:

1. Go to **"Variables"** tab
2. Update `CORS_ORIGIN` with your frontend URL:
   ```
   CORS_ORIGIN=https://your-frontend.up.railway.app
   ```

---

### Step 6: Initialize Database

You need to run the database initialization script. Options:

#### Option A: Using Railway CLI

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Link your project:
   ```bash
   railway link
   ```

4. Connect to database and run init:
   ```bash
   railway run psql $DATABASE_URL -f database/init.sql
   ```

#### Option B: Using Railway Console

1. Click on your PostgreSQL service
2. Go to **"Data"** tab
3. Click **"Query"** 
4. Copy and paste the contents of `database/init.sql`
5. Execute the query

---

## Environment Variables Summary

### Backend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Auto-provided by Railway PostgreSQL | (auto) |
| `NODE_ENV` | Environment mode | `production` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-32-char-secret-key` |
| `JWT_EXPIRES_IN` | Token expiration time | `8h` |
| `CORS_ORIGIN` | Frontend URL for CORS | `https://frontend.up.railway.app` |
| `PORT` | Auto-provided by Railway | (auto) |

### Frontend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://backend.up.railway.app/api` |

---

## Troubleshooting

### Build Failures

1. Check the **"Deploy Logs"** in Railway dashboard
2. Ensure `node` version in `package.json` engines matches
3. Verify all dependencies are in `dependencies`, not `devDependencies`

### Database Connection Issues

1. Ensure PostgreSQL service is running (green status)
2. Verify `DATABASE_URL` is linked to backend service
3. Check backend logs for connection errors

### CORS Errors

1. Verify `CORS_ORIGIN` matches exact frontend URL
2. Include protocol (`https://`)
3. No trailing slash in URL

### Frontend Can't Reach Backend

1. Verify `VITE_API_URL` is correct
2. Ensure backend service has a public domain
3. Check backend is running (green status)

---

## Default Login Credentials

After database initialization, use these credentials:

- **Email:** `admin@raymond.com`
- **Password:** `Admin@123`

⚠️ **Change this password immediately after first login!**

---

## Useful Railway Commands

```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# View logs
railway logs

# Open shell in service
railway shell

# Run command in service context
railway run <command>

# View environment variables
railway variables
```

---

## Architecture on Railway

```
┌─────────────────────────────────────────────────────────┐
│                   Railway Project                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────┐ │
│  │   Frontend   │───▶│   Backend    │───▶│ PostgreSQL│ │
│  │   (React)    │    │  (Node.js)   │    │    DB     │ │
│  └──────────────┘    └──────────────┘    └───────────┘ │
│        │                    │                   │       │
│        ▼                    ▼                   ▼       │
│   Public URL           Public URL          Internal    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Cost Estimation

Railway offers:
- **Hobby Plan:** $5/month credit (usually enough for small apps)
- **Pro Plan:** Pay for what you use

Estimated monthly cost for this project:
- PostgreSQL: ~$5-10/month
- Backend: ~$5-10/month
- Frontend: ~$2-5/month
- **Total:** ~$12-25/month

---

## Support

For Railway-specific issues: [Railway Docs](https://docs.railway.app)
For application issues: Check the repository issues on GitHub
