# Deploying KeyWebSite to Vercel

## Prerequisites
- ✅ Next.js project (already set up)
- ✅ Git repository (already initialized)
- ✅ Vercel account (sign up at https://vercel.com)

---

## Method 1: Deploy via Vercel Dashboard (Recommended for Beginners)

### Step 1: Commit and Push Your Changes

```bash
# Add all changes
git add .

# Commit with a message
git commit -m "Add mobile-first responsive design with hamburger menu"

# Push to your remote repository
git push origin main
```

### Step 2: Connect to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in (or create an account)
2. **Click "Add New..." → "Project"**
3. **Import your Git repository:**
   - If your repo is on GitHub/GitLab/Bitbucket, Vercel will show it
   - Click "Import" next to your `KeyWebSite` repository

### Step 3: Configure Project Settings

Vercel will auto-detect Next.js, but verify these settings:

- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

### Step 4: Environment Variables (if needed)

If you have any environment variables (API keys, etc.):
- Click "Environment Variables"
- Add them here (e.g., `NEXT_PUBLIC_API_URL`, `DATABASE_URL`)

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Your site will be live at: `https://keywebsite.vercel.app` (or a custom domain)

---

## Method 2: Deploy via Vercel CLI (For Developers)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
# From your project root directory
cd /home/khoatran/Workspaces/Projects/KeyWebSite

# Deploy to production
vercel --prod
```

The CLI will:
- Ask you to link the project (first time)
- Run the build
- Deploy to production
- Give you a URL

---

## Post-Deployment Checklist

### ✅ Verify Build Success
- Check the build logs in Vercel dashboard
- Ensure no errors occurred

### ✅ Test Your Site
- Visit the deployed URL
- Test mobile responsiveness
- Test all features (cart, navigation, etc.)

### ✅ Set Up Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### ✅ Configure Environment Variables (if needed)
- Go to Project Settings → Environment Variables
- Add any required variables for production

---

## Important Notes

### Build Configuration
Your `next.config.ts` is already configured correctly:
- ✅ Image domains configured (`img.vietqr.io`)
- ✅ TypeScript enabled
- ✅ Build script exists in `package.json`

### What Gets Deployed
- ✅ All your code
- ✅ Dependencies from `package.json`
- ✅ Static assets from `public/` folder
- ✅ Environment variables (set in Vercel dashboard)

### What Doesn't Get Deployed
- ❌ `.env.local` files (use Vercel Environment Variables instead)
- ❌ `node_modules` (installed during build)
- ❌ `.git` folder
- ❌ Files in `.gitignore`

---

## Troubleshooting

### Build Fails
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Check for TypeScript errors: `npm run build` locally first

### Images Not Loading
- Verify `next.config.ts` has correct `remotePatterns`
- Check image URLs are using HTTPS

### Environment Variables Not Working
- Ensure variables are set in Vercel dashboard
- Restart deployment after adding variables
- Use `NEXT_PUBLIC_` prefix for client-side variables

---

## Continuous Deployment

Once connected:
- ✅ Every push to `main` branch = automatic production deployment
- ✅ Pull requests = preview deployments (for testing)
- ✅ Automatic HTTPS
- ✅ Global CDN

---

## Quick Commands Reference

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List all deployments
vercel ls
```

---

## Need Help?

- 📖 [Vercel Documentation](https://vercel.com/docs)
- 💬 [Vercel Community](https://github.com/vercel/vercel/discussions)
- 🐛 [Report Issues](https://github.com/vercel/vercel/issues)
