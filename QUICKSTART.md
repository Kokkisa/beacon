# 🚀 Beacon Quick Start — Deploy in 15 Minutes

Your production-ready SaaS is ready to go live!

## Step 1: Push to GitHub (You Do This)

Since the remote is already set to `https://github.com/nivoratech-commits/beacon.git`:

```bash
cd /path/to/beacon

# Verify remote is set
git remote -v
# origin	https://github.com/nivoratech-commits/beacon.git (fetch)
# origin	https://github.com/nivoratech-commits/beacon.git (push)

# Push to GitHub (use Personal Access Token if prompted)
git push -u origin main
```

**If you get authentication error:**
- Go to https://github.com/settings/tokens
- Create a **Personal Access Token** with `repo` scope
- Use token as password when prompted

---

## Step 2: Deploy Frontend to Vercel (5 min)

1. Go to **https://vercel.com** → Sign up/Login
2. Click **"New Project"**
3. Click **"Import Git Repository"**
4. Select `nivoratech-commits/beacon`
5. **Root Directory:** `apps/web`
6. **Build Command:** `pnpm run build`
7. **Output Directory:** `dist`
8. **Environment Variables:**
   ```
   VITE_API_URL=https://api.beacon.yourdomain.com
   ```
   (Or use Railway's auto-generated URL later)
9. Click **"Deploy"**

**Result:** Your frontend is live at `beacon.vercel.app` in 2-3 minutes

---

## Step 3: Deploy Backend to Railway (5 min)

1. Go to **https://railway.app** → Sign up/Login
2. Click **"New Project"**
3. Click **"Deploy from GitHub"**
4. Authorize and select `nivoratech-commits/beacon`
5. Railway will ask to create services:
   - ✅ Let it create PostgreSQL database
   - ✅ Let it create Redis cache
   - Create Node.js service (manually)

6. **For Node.js Service:**
   - Select GitHub repo (it's already selected)
   - **Start Command:** `cd apps/api && npm run start`
   - **Root Directory:** `./` (leave as is)

7. **Add Environment Variables:**
   ```
   DATABASE_URL=<from PostgreSQL plugin>
   REDIS_URL=<from Redis plugin>
   JWT_SECRET=super-secret-change-in-prod
   JWT_REFRESH_SECRET=another-secret-change-in-prod
   FRONTEND_URL=https://beacon.vercel.app
   PORT=3001
   NODE_ENV=production
   SHOPIFY_API_KEY=
   SHOPIFY_API_SECRET=
   AMAZON_CLIENT_ID=
   AMAZON_CLIENT_SECRET=
   STRIPE_SECRET_KEY=
   RESEND_API_KEY=
   ```

8. Click **"Deploy"**

**Result:** Your backend is live at `railway's-auto-domain.up.railway.app`

---

## Step 4: Run Database Migrations (2 min)

Once backend is deployed:

```bash
# Via Railway CLI (if installed)
railway run "cd apps/api && npx prisma migrate deploy"

# Or manually in Railway dashboard:
# 1. Go to Node.js service → Deployments
# 2. Click latest deployment
# 3. Go to "Shell" tab
# 4. Run: cd apps/api && npx prisma migrate deploy
```

---

## Step 5: Update Frontend API URL (1 min)

If you got a Railway URL (not your custom domain yet):

1. Go to **Vercel Dashboard** → Your Beacon project
2. **Settings** → **Environment Variables**
3. Change `VITE_API_URL` to your Railway backend URL
4. Click **"Redeploy"** (Vercel will rebuild)

---

## Step 6: Test It Works (2 min)

### Frontend Health
```bash
curl https://beacon.vercel.app/
# Should load the Beacon landing page
```

### Backend Health
```bash
curl https://your-railway-url.up.railway.app/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Try the App
1. Visit **https://beacon.vercel.app**
2. Click **"Get Started"**
3. Register a test account
4. Verify email (check console or skip for testing)
5. Login
6. See Dashboard
7. Click "Integrations" → Try connecting a store

---

## Step 7: Custom Domain (Optional but Recommended)

### Frontend Domain (Vercel)

1. **Vercel Dashboard** → Project → Settings → Domains
2. Add your domain (e.g., `beacon.yourdomain.com`)
3. Vercel gives you CNAME record
4. Add to your DNS provider:
   ```
   beacon.yourdomain.com  CNAME  cname.vercel.com
   ```
5. Wait 5-10 min for DNS propagation
6. Visit `https://beacon.yourdomain.com` 🎉

### Backend Domain (Railway)

1. **Railway Dashboard** → Node.js Service → Settings
2. Custom Domain → Add domain
3. Railway gives you CNAME record
4. Add to DNS:
   ```
   api.beacon.yourdomain.com  CNAME  railway-auto-domain
   ```
5. Update `VITE_API_URL` in Vercel to your custom domain
6. Redeploy Vercel

---

## ✅ You're Live!

Your Beacon SaaS is now live at:
- **Frontend:** https://beacon.yourdomain.com
- **Backend:** https://api.beacon.yourdomain.com
- **Database:** PostgreSQL on Railway (auto-managed)

---

## 🐛 Troubleshooting

### "Build Failed" on Vercel
- Check that `apps/web/package.json` exists
- Verify Root Directory is `apps/web`
- Check environment variables are set

### "Deploy Failed" on Railway
- Check Railway logs: Dashboard → Deployments → View Logs
- Ensure `DATABASE_URL` is set (from PostgreSQL plugin)
- Check Node version (should be 20+)

### Can't Connect to Backend
- Check `VITE_API_URL` in Vercel matches your Railway URL
- Verify backend is running: `curl /health` endpoint
- Check CORS is enabled in Express (`app.ts`)

### Database Migration Failed
- SSH into Railway container and run manually
- Or reset DB (⚠️ **deletes all data**):
  ```bash
  railway run "cd apps/api && npx prisma migrate reset"
  ```

---

## 📊 Monitoring

### Vercel
- Dashboard shows build/deployment status
- Auto-redeploys on git push to main

### Railway
- View logs: Dashboard → Service → Logs
- Monitor metrics: CPU, memory, requests
- Webhooks: Set up GitHub webhook for auto-deploy

---

## 🎯 Next Steps

### Today
- [ ] Push to GitHub
- [ ] Deploy Vercel (frontend)
- [ ] Deploy Railway (backend)
- [ ] Run migrations
- [ ] Test login/dashboard

### This Week
- [ ] Set up Shopify app (get API keys)
- [ ] Set up Amazon SP-API (get credentials)
- [ ] Add to Product Hunt (optional)
- [ ] Share on Twitter/HackerNews
- [ ] Get beta users

### Next Week
- [ ] Monitor errors (check Sentry/logs)
- [ ] Fix bugs reported by users
- [ ] Start Phase 5 (email notifications, tracking page)
- [ ] Plan Phase 6 (Stripe billing)

---

## 🔐 Important Security Notes

**DO THIS BEFORE GOING PUBLIC:**

1. **Change JWT Secrets** (currently in env)
   ```bash
   # Generate new secrets
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Update in Railway → Environment Variables

2. **Enable HTTPS** (auto on Vercel/Railway)

3. **Set CORS properly** (frontend domain)
   - Update `FRONTEND_URL` in backend env

4. **Set up monitoring** (Sentry)
   - Get Sentry DSN from sentry.io
   - Add `SENTRY_DSN` to Railway env

5. **Enable database backups**
   - Railway → PostgreSQL → Settings → Automated Backups

6. **Rotate keys regularly** for Shopify/Amazon APIs

---

## 📞 Support

- **Local Dev Issues:** Check `README.md`
- **Deployment Issues:** Check `DEPLOYMENT.md`
- **Code Issues:** Check comments in `apps/api/src` and `apps/web/src`
- **GitHub Issues:** Create issue in the repository

---

## 🚀 You're Ready!

**Beacon is production-ready.** All you need to do is:

1. ✅ Push code to GitHub (git push)
2. ✅ Connect Vercel (10 clicks, 2 min)
3. ✅ Connect Railway (15 clicks, 3 min)
4. ✅ Test (visit the URL)
5. 🎉 **LIVE!**

---

**Your fulfillment SaaS is now live. Time to get customers!** 🔦

Questions? Check the deployment guides or GitHub issues.
