# Beacon Deployment Guide

Deploy Beacon to production with Vercel (frontend) + Railway (backend).

## Prerequisites

- GitHub account (repository must be public or private with access)
- Vercel account (free)
- Railway account (free tier available)
- Domain name (optional, for custom domain)

## Step 1: Prepare GitHub Repository

```bash
# Push to GitHub
git remote add origin https://github.com/yourusername/beacon.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Frontend to Vercel

### Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. **Framework Preset:** Select "Other"
5. **Root Directory:** `./apps/web`
6. **Build Command:** `pnpm run build`
7. **Output Directory:** `dist`
8. **Environment Variables:**
   ```
   VITE_API_URL=https://api.beacon.yourdomain.com
   VITE_SENTRY_DSN=(optional)
   ```
9. Click "Deploy"

### Or via CLI

```bash
npm i -g vercel
vercel --cwd apps/web
```

**Result:** Frontend deployed to `beacon.vercel.app` or your custom domain

---

## Step 3: Deploy Backend to Railway

### Via Railway CLI

```bash
npm i -g @railway/cli
railway login

# In project root
railway init
railway link  # Link to Railway project
railway up    # Deploy
```

### Or via Dashboard

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Choose "Deploy from GitHub"
4. Connect your beacon repository
5. Create PostgreSQL plugin
6. Create Redis plugin
7. Create Node.js service
8. **Root Directory:** `./`
9. **Start Command:** `cd apps/api && npm run start`

### Environment Variables in Railway

Set these in Railway dashboard under your API service:

```env
DATABASE_URL=postgresql://user:pass@host:5432/beacon
REDIS_URL=redis://host:port
JWT_SECRET=your-super-secret-key-change-this
JWT_REFRESH_SECRET=another-secret-key
FRONTEND_URL=https://beacon.vercel.app
PORT=3001
NODE_ENV=production

# Shopify
SHOPIFY_API_KEY=your-shopify-key
SHOPIFY_API_SECRET=your-shopify-secret
SHOPIFY_API_VERSION=2024-01

# Amazon
AMAZON_CLIENT_ID=your-amazon-client-id
AMAZON_CLIENT_SECRET=your-amazon-client-secret
AMAZON_REGION=us-east-1

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Email
RESEND_API_KEY=your-resend-api-key
SENDER_EMAIL=noreply@beacon.yourdomain.com

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

**Result:** Backend deployed to `api.yourdomain.com` or Railway's auto-domain

---

## Step 4: Connect Databases

### PostgreSQL (Railway)

Railway automatically creates a PostgreSQL database. Get the `DATABASE_URL` from the PostgreSQL plugin dashboard.

Run migrations:

```bash
# From Railway CLI
railway run "cd apps/api && npx prisma migrate deploy"

# Or manually
DATABASE_URL="postgresql://..." npx prisma db push
```

### Redis (Railway)

Railway automatically creates Redis. Get the `REDIS_URL` from the Redis plugin dashboard.

---

## Step 5: Configure Custom Domain (Optional)

### Vercel Frontend

1. Go to Vercel dashboard → Project settings
2. Domains → Add domain
3. Add DNS records (CNAME or A record)
4. Verify domain

### Railway Backend

1. Go to Railway dashboard → Service → Settings
2. Custom Domain → Add domain
3. Get CNAME record
4. Add to DNS provider
5. Verify

**Example DNS Records:**
```
beacon.yourdomain.com    CNAME    beacon.vercel.app
api.beacon.yourdomain.com  CNAME    api-prod.railway.app
```

---

## Step 6: Update Environment Variables

### Vercel Frontend

```
VITE_API_URL=https://api.beacon.yourdomain.com
```

### Railway Backend

```
FRONTEND_URL=https://beacon.yourdomain.com
```

Redeploy both after updating.

---

## Step 7: Test Deployments

### Frontend Health Check

```bash
curl https://beacon.yourdomain.com/
# Should return HTML
```

### Backend Health Check

```bash
curl https://api.beacon.yourdomain.com/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Test Auth Flow

1. Visit frontend: `https://beacon.yourdomain.com`
2. Register new account
3. Login
4. Check Dashboard
5. Navigate to Integrations

---

## Step 8: Set Up Monitoring & Logging

### Sentry (Error Tracking)

1. Go to [sentry.io](https://sentry.io)
2. Create project for Node.js
3. Copy DSN
4. Add `SENTRY_DSN` to Railway environment

### Railway Logs

View logs in Railway dashboard:
```bash
railway logs -s api
```

---

## Continuous Deployment (CI/CD)

GitHub Actions automatically:
1. Runs tests on push
2. Builds on main branch
3. Deploys to Vercel (frontend)
4. Deploys to Railway (backend)

View workflow: `.github/workflows/ci.yml`

---

## Troubleshooting

### Frontend Not Loading

- Check `VITE_API_URL` in Vercel environment
- Ensure backend is running
- Check browser console for CORS errors

### Backend Connection Refused

- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running (Railway dashboard)
- Verify `REDIS_URL` if using Redis features

### Auth Not Working

- Check `JWT_SECRET` matches on backend
- Verify `FRONTEND_URL` on backend matches frontend domain
- Check cookies are being set (browser dev tools)

### Database Migrations Failed

```bash
railway run "cd apps/api && npx prisma db push"
# Or reset (⚠️ deletes data):
railway run "cd apps/api && npx prisma migrate reset"
```

### Environment Variables Not Loading

- Redeploy after changing environment variables
- Verify variables are set in Railway/Vercel dashboard
- Don't commit secrets to GitHub

---

## Production Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway
- [ ] PostgreSQL database configured
- [ ] Redis configured (if using sync jobs)
- [ ] Environment variables set on both platforms
- [ ] Custom domain configured (optional)
- [ ] Sentry configured for error tracking
- [ ] SSL certificate installed (auto with Vercel/Railway)
- [ ] Database backups enabled
- [ ] CI/CD pipeline tested
- [ ] Health checks passing
- [ ] Auth flow tested end-to-end
- [ ] Integrations settings accessible

---

## Support

For issues:
1. Check Railway logs: `railway logs -s api`
2. Check Vercel build logs in dashboard
3. Test locally first: `pnpm dev`
4. Check environment variables match `.env.example`

---

## Next Steps

1. Set up Shopify app in Shopify Partner dashboard
2. Add Shopify OAuth credentials
3. Set up Amazon SP-API credentials
4. Configure Stripe for billing
5. Add custom email domain (Resend)

Enjoy your deployed Beacon! 🔦
