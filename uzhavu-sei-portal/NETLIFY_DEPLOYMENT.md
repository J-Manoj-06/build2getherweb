# Uzhavu SEI Portal - Netlify Deployment Guide

## 📋 Project Overview

**Uzhavu SEI Portal** is a React + Vite web application built for farmers and machinery owners to manage harvesting logistics and machinery sharing.

### Tech Stack
- **Frontend Framework**: React 19 with React Router
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React icons
- **State Management**: React Context API
- **Package Manager**: npm

---

## 🚀 Deployment Setup Completed

The following files have been created/configured for Netlify deployment:

### 1. **netlify.toml**
- Build configuration pointing to `npm run build`
- Publish directory: `dist/`
- Production deployment context
- SPA routing rules (rewrites all requests to index.html)
- Security headers (X-Frame-Options, CSP, etc.)
- Cache control for assets
- Preview and branch deployment contexts

### 2. **.env Files**
- **`.env.example`** - Template for environment variables
- **`.env.production`** - Production environment variables
- **`.env.development`** - Development environment variables

### 3. **vite.config.js** (Updated)
- Build optimization settings
- Minification with Terser (console.log removal)
- Dev server proxy for API calls
- Global variable definitions
- Proper source mapping configuration

### 4. **package.json** (Updated)
- New build scripts: `build:prod` for explicit production builds
- Type-check script placeholder

### 5. **index.html** (Enhanced)
- SEO meta tags (description, keywords, author)
- Open Graph tags for social sharing
- Twitter Card tags
- Improved page title
- Theme color specification

---

## 📝 Pre-Deployment Checklist

### ✅ Required Steps

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub/GitLab/Bitbucket (recommended)

2. **Push Code to Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Uzhavu SEI Portal with Netlify config"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

3. **Environment Variables**
   Update the `.env.production` file with your actual API endpoints:
   ```
   VITE_API_URL=https://your-api-domain.com
   VITE_AUTH_API_ENDPOINT=https://your-api-domain.com/auth
   VITE_ANALYTICS_ID=your-analytics-id
   ```

4. **Connect Repository to Netlify**
   - In Netlify dashboard: **New site from Git**
   - Select your Git provider
   - Choose the repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
     - **Node version**: 20 (or latest LTS)
     - **Add environment variables** from `.env.production`

5. **Verify Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions` (if needed later)

---

## 🔧 Environment Variables to Configure

### In Netlify Dashboard (Build & Deploy → Environment):

```
VITE_API_URL=https://your-api-domain.com
VITE_APP_ENV=production
VITE_AUTH_API_ENDPOINT=https://your-api-domain.com/auth
VITE_JWT_SECRET=your_jwt_secret_key_here
VITE_ENABLE_AI_PREDICTIONS=true
VITE_ENABLE_ANALYTICS=true
VITE_ANALYTICS_ID=your-analytics-id
```

---

## 🎯 Quick Deploy Steps

### Option 1: Connect Git Repository (Recommended)
1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [app.netlify.com](https://app.netlify.com)
3. Click **Add new site** → **Import an existing project**
4. Select your Git provider and repository
5. Configure build settings (already in `netlify.toml`)
6. Deploy!

### Option 2: Netlify CLI
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from project directory
netlify deploy --prod

# For preview deployment
netlify deploy
```

### Option 3: Drag & Drop (Testing Only)
1. Build locally: `npm run build`
2. Go to [drop.netlify.com](https://drop.netlify.com)
3. Drag the `dist` folder
4. Done! (Limited for production use)

---

## 🏗️ Build & Preview Locally

```bash
# Install dependencies
npm install

# Development mode with hot reload
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Build with explicit production mode
npm run build:prod
```

---

## 🔐 Security Configuration

### Security Headers (Configured in netlify.toml)
- **X-Content-Type-Options**: Prevents MIME sniffing
- **X-Frame-Options**: DENY (protects against clickjacking)
- **X-XSS-Protection**: Enables XSS filter
- **Referrer-Policy**: Strict origin-when-cross-origin
- **Permissions-Policy**: Restricts browser features

### Recommendations
1. **Enable HTTPS**: Netlify provides free HTTPS with Let's Encrypt
2. **Add Custom Domain**: Point your domain to Netlify
3. **Enable Password Protection**: For staging environments
4. **Form Handling**: Use Netlify Forms if needed
5. **API Keys**: Store sensitive keys in environment variables, never in code

---

## 🌐 Custom Domain Setup

1. Go to **Domain settings** in Netlify
2. Add your custom domain
3. Update DNS records (Netlify will provide instructions)
4. Wait for DNS propagation (usually 24-48 hours)

### Example DNS Records:
```
Type: CNAME
Name: www
Value: your-site.netlify.app

Type: ALIAS or ANAME (apex domain)
Name: @ (or leave blank)
Value: your-site.netlify.app
```

---

## 📊 Monitoring & Analytics

### Netlify Analytics
- Available in **Analytics** tab in dashboard
- Tracks build times, deploys, and traffic

### Logs & Debugging
- **Deploy logs**: See build errors in Netlify dashboard
- **Runtime logs**: Available in real-time monitoring
- **Error tracking**: Enable in site settings

---

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Verify Node version compatibility
- Ensure all environment variables are set
- Run `npm run build` locally to test

### SPA Routing Issues
- The `netlify.toml` includes rewrite rules for SPA
- All URLs are rewritten to `/index.html`
- React Router handles the routing

### Environment Variables Not Working
- Ensure variables start with `VITE_` (Vite requirement)
- Rebuild after adding variables
- Check Netlify dashboard environment tab

### API CORS Issues
- Update your backend CORS configuration
- Allow `https://your-site.netlify.app` domain
- Test with API endpoint URLs

---

## 📦 Production Optimization

### Already Configured:
- ✅ Terser minification
- ✅ Console log removal
- ✅ ES2020 target
- ✅ Asset hashing for cache busting
- ✅ Gzip compression (default Netlify)
- ✅ Security headers

### Additional Optimization Tips:
1. **Use Netlify Edge Functions** for dynamic content
2. **Enable Gzip compression** (default)
3. **Implement caching strategies** for API calls
4. **Use code splitting** for large components
5. **Optimize images** before deployment

---

## 🔄 Continuous Deployment

### Auto-Deploy on Push
- Every push to `main` branch triggers build
- Failed builds block deployment
- Preview deployments for pull requests (optional)

### Rollback
- Netlify keeps deployment history
- Click **Deploys** → Select previous version → **Publish**

---

## 📱 Mobile Considerations

The app is already mobile-friendly:
- ✅ Responsive viewport meta tag
- ✅ Tailwind CSS responsive design
- ✅ Mobile-first approach
- ✅ Touch-friendly UI elements (Lucide icons)

---

## 🎉 Post-Deployment

### Verify Deployment
1. Visit your Netlify URL: `https://your-site.netlify.app`
2. Test all routes (login, register, dashboards)
3. Verify API calls work correctly
4. Check console for any errors
5. Test on mobile devices

### Next Steps
1. Set up custom domain
2. Configure DNS with domain provider
3. Enable Netlify Edge Functions if needed
4. Set up email notifications for build failures
5. Configure preview deployments for pull requests
6. Set up analytics and monitoring

---

## 📚 Additional Resources

- [Netlify Documentation](https://docs.netlify.com)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)
- [Netlify CLI Documentation](https://cli.netlify.com)
- [React Documentation](https://react.dev)

---

## 🆘 Need Help?

- **Netlify Support**: https://support.netlify.com
- **Build Issues**: Check Netlify build logs
- **Local Issues**: Run `npm run build` to test builds locally
- **API Issues**: Verify CORS and endpoint URLs

---

**Happy Deploying! 🚀**

Your Uzhavu SEI Portal is ready for production deployment on Netlify.
