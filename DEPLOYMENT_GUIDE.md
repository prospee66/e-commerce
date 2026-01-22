# Deployment Guide - Life Goes On Hub

## Option 1: Vercel (Recommended) ⭐

### Why Vercel?
- ✅ FREE hosting for personal projects
- ✅ Automatic HTTPS/SSL
- ✅ Deploy directly from GitHub
- ✅ Fast global CDN
- ✅ Zero configuration needed
- ✅ Perfect for React/Vite apps
- ✅ Custom domain support (free)

### Steps to Deploy:

1. **Create Vercel Account**
   - Go to https://vercel.com/signup
   - Sign up with your GitHub account
   - This connects Vercel to your repositories

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Select your `e-commerce` repository
   - Vercel auto-detects it's a Vite project

3. **Configure Environment Variables**
   - Click "Environment Variables"
   - Add: `VITE_PAYSTACK_PUBLIC_KEY` = `pk_test_21615babab12fd85f67270ec8b1cf724b7f92d78`
   - **IMPORTANT:** Use your LIVE Paystack key when ready for production

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at `your-project.vercel.app`

5. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., `lifegoeson.com`)
   - Follow DNS configuration instructions
   - SSL certificate auto-generated

### Auto-Deploy on Git Push
- Every time you push to GitHub, Vercel automatically deploys
- Preview deployments for pull requests
- Rollback to previous versions anytime

---

## Option 2: Netlify (Alternative)

### Why Netlify?
- ✅ FREE tier available
- ✅ Easy drag-and-drop deployment
- ✅ Automatic HTTPS
- ✅ Form handling built-in
- ✅ Custom domain support

### Steps to Deploy:

1. **Create Netlify Account**
   - Go to https://app.netlify.com/signup
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "Add new site" → "Import from Git"
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

3. **Add Environment Variables**
   - Site Settings → Environment Variables
   - Add: `VITE_PAYSTACK_PUBLIC_KEY`

4. **Deploy**
   - Click "Deploy site"
   - Live at `random-name.netlify.app`
   - Change site name in settings

---

## Option 3: GitHub Pages (Free Static Hosting)

### Pros:
- ✅ Completely FREE
- ✅ Hosted on GitHub
- ✅ Custom domain support

### Cons:
- ⚠️ Requires extra configuration for React Router
- ⚠️ Manual deployment process

### Steps to Deploy:

1. **Install GitHub Pages Package**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   Add these lines:
   ```json
   {
     "homepage": "https://prospee66.github.io/e-commerce",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update vite.config.js**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/e-commerce/'
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: `gh-pages` branch
   - Save

---

## Option 4: Render (Good for Full-Stack)

### Why Render?
- ✅ FREE tier for static sites
- ✅ Good for adding backend later
- ✅ Automatic HTTPS
- ✅ PostgreSQL database available

### Steps:
1. Go to https://render.com
2. Sign up with GitHub
3. New → Static Site
4. Select repository
5. Build: `npm run build`
6. Publish: `dist`
7. Deploy

---

## Important: Before Going Live

### 1. **Update Paystack Keys**
   Currently using TEST keys. For real payments:
   - Get LIVE keys from Paystack Dashboard
   - Update `VITE_PAYSTACK_PUBLIC_KEY` in hosting platform
   - Complete Paystack business verification

### 2. **Environment Variables**
   Make sure these are set in your hosting platform:
   - `VITE_PAYSTACK_PUBLIC_KEY` - Your Paystack public key

### 3. **Update Contact Information**
   Replace placeholder contact info:
   - Phone: +233 123 456 789 → Your real number
   - Email: support@lifegoeson.com → Your real email
   - WhatsApp: Update the number in HelpPage.jsx
   - Address: Update in ContactPage.jsx and Footer.jsx

### 4. **Test Payment Flow**
   - Use Paystack test cards first
   - Verify payment success/failure handling
   - Check order confirmation flow

### 5. **Performance Optimization**
   Already done:
   - ✅ Code splitting
   - ✅ Lazy loading
   - ✅ Image optimization
   - ✅ Minified production build

### 6. **SEO Optimization**
   Already done:
   - ✅ Meta tags
   - ✅ Proper headings
   - ✅ Semantic HTML
   - ✅ Mobile-friendly

---

## Custom Domain Setup

### Buy a Domain:
- **Namecheap** - https://namecheap.com (~$10/year)
- **GoDaddy** - https://godaddy.com
- **Domain.com** - https://domain.com
- **Ghana Domains** - .com.gh domains

### Connect Domain to Vercel/Netlify:
1. Add domain in hosting platform
2. Copy DNS records provided
3. Update your domain's DNS settings
4. Wait 24-48 hours for propagation
5. SSL automatically enabled

---

## Cost Breakdown

### FREE Option (Recommended):
- ✅ Vercel/Netlify hosting: **FREE**
- ✅ GitHub repository: **FREE**
- ✅ SSL certificate: **FREE (auto-included)**
- ❌ Custom domain: ~$10-15/year (optional)

**Total: $0-15/year**

### Paid Option (If needed later):
- Hosting upgrade: $20-50/month
- Backend hosting: $7-25/month
- Database: $0-15/month
- Custom domain: $10-15/year

---

## Deployment Checklist

- [ ] Create account on hosting platform
- [ ] Connect GitHub repository
- [ ] Set environment variables
- [ ] Configure build settings
- [ ] Deploy and test
- [ ] Update Paystack to LIVE keys (when ready)
- [ ] Update contact information
- [ ] Test all payment flows
- [ ] Set up custom domain (optional)
- [ ] Test on mobile, tablet, desktop
- [ ] Monitor for errors

---

## Recommended Workflow

### For Development:
1. Make changes locally
2. Test with `npm run dev`
3. Commit to GitHub
4. Push to main branch

### Auto-Deployment:
- Vercel/Netlify automatically builds and deploys
- Changes live in 2-3 minutes
- No manual deployment needed!

---

## Monitoring & Analytics

### Add Google Analytics (Optional):
1. Create GA4 account
2. Add tracking code to `index.html`
3. Monitor traffic and conversions

### Error Tracking (Optional):
- **Sentry** - Free tier available
- Tracks JavaScript errors
- Helps debug production issues

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html
- **Paystack Docs**: https://paystack.com/docs

---

## Quick Start (Vercel - 5 Minutes)

1. Push code to GitHub ✅ (Already done!)
2. Go to https://vercel.com/signup
3. Sign in with GitHub
4. Import `e-commerce` repository
5. Add environment variable: `VITE_PAYSTACK_PUBLIC_KEY`
6. Click Deploy
7. **Done!** Your site is live 🎉

---

## Need Help?

If you encounter issues:
1. Check build logs in hosting platform
2. Verify environment variables are set
3. Test locally with `npm run build` then `npm run preview`
4. Contact hosting platform support (very responsive)

Good luck with your deployment! 🚀
