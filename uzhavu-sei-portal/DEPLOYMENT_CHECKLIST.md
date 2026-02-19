# 🚀 Netlify Deployment Checklist for Uzhavu SEI Portal

## Pre-Deployment Phase

### 1. Code Preparation
- [ ] All code committed to Git repository
- [ ] No sensitive data in code (API keys, tokens, passwords)
- [ ] Environment variables properly configured
- [ ] `.env.production` updated with real API endpoints
- [ ] All dependencies installed (`npm install`)
- [ ] Local build successful (`npm run build`)
- [ ] No console errors during build
- [ ] `.gitignore` configured properly

### 2. Repository Setup
- [ ] Repository created on GitHub/GitLab/Bitbucket
- [ ] Code pushed to remote repository
- [ ] Main/master branch is default
- [ ] No merge conflicts
- [ ] Branch protection rules configured (optional)

### 3. Project Verification
- [ ] `netlify.toml` file present and configured
- [ ] `package.json` has correct build command
- [ ] `vite.config.js` properly configured
- [ ] `index.html` has proper meta tags
- [ ] `.env.example` exists with all variables
- [ ] `NETLIFY_DEPLOYMENT.md` reviewed
- [ ] `README.md` updated with project info

---

## Netlify Account Setup

### 4. Netlify Account
- [ ] Netlify account created (https://netlify.com)
- [ ] Account email verified
- [ ] GitHub/GitLab/Bitbucket connected
- [ ] Team created (optional)
- [ ] Billing method added if needed

### 5. Site Creation
- [ ] New site created in Netlify dashboard
- [ ] Git repository connected
- [ ] Repository permissions granted
- [ ] Build settings verified:
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `dist`
  - [ ] Node version: 20 or latest LTS

---

## Configuration Phase

### 6. Environment Variables
- [ ] Set `VITE_API_URL` to production backend
- [ ] Set `VITE_APP_ENV` to `production`
- [ ] Set `VITE_AUTH_API_ENDPOINT` with backend auth URL
- [ ] Set `VITE_JWT_SECRET` if needed
- [ ] Set `VITE_ENABLE_AI_PREDICTIONS` to `true`
- [ ] Set `VITE_ENABLE_ANALYTICS` to `true`
- [ ] Set `VITE_ANALYTICS_ID` if using analytics
- [ ] All variables prefixed with `VITE_` (Vite requirement)
- [ ] Variables added in Netlify: Site settings → Build & deploy → Environment

### 7. Build Configuration
- [ ] Build command verified in netlify.toml
- [ ] Publish directory set to `dist`
- [ ] Functions directory configured (if needed)
- [ ] Redirects configured for SPA routing
- [ ] Headers configured for security
- [ ] Cache policies configured

### 8. Domain Configuration
- [ ] Custom domain name purchased/prepared
- [ ] Netlify domain generated and tested
- [ ] DNS records updated (if custom domain)
- [ ] SSL/HTTPS enabled (automatic with Netlify)
- [ ] Domain verified and propagated

---

## Testing Phase

### 9. Pre-Deployment Testing
- [ ] Local build tested: `npm run build && npm run preview`
- [ ] All routes accessible locally
- [ ] Forms validate correctly
- [ ] API calls work in development
- [ ] Responsive design tested on mobile
- [ ] Navigation works correctly
- [ ] No console errors in browser dev tools

### 10. Build Testing on Netlify
- [ ] Initial deploy triggered
- [ ] Build logs checked for errors
- [ ] Build completed successfully
- [ ] Netlify URL accessible
- [ ] All routes working on Netlify
- [ ] Mobile responsive on Netlify deployment
- [ ] Network requests working

### 11. Functionality Testing
- [ ] Login page loads and works
- [ ] Registration page loads and works
- [ ] Authentication flows complete
- [ ] Dashboard pages load
- [ ] Farmer routes accessible
- [ ] Buyer routes accessible
- [ ] All UI components render correctly
- [ ] Images and assets load
- [ ] Styling applied correctly

### 12. API Integration Testing
- [ ] API requests reach correct endpoints
- [ ] Response data displayed correctly
- [ ] Error handling works
- [ ] CORS issues resolved (if any)
- [ ] Authorization headers sent correctly
- [ ] Token refresh working

---

## Security & Performance Phase

### 13. Security Checks
- [ ] No API keys exposed in client code
- [ ] Environment variables not logged
- [ ] HTTPS enforced (automatic on Netlify)
- [ ] Security headers configured
- [ ] X-Frame-Options set to DENY
- [ ] CSP headers configured
- [ ] No sensitive data in localStorage without encryption
- [ ] Form submission secure

### 14. Performance Optimization
- [ ] Build size checked (`npm run build` output)
- [ ] Assets minified and optimized
- [ ] No unused dependencies
- [ ] Lazy loading implemented for routes
- [ ] Images optimized
- [ ] CSS purged of unused classes
- [ ] JavaScript minified

### 15. SEO & Meta Tags
- [ ] Page title descriptive
- [ ] Meta descriptions added
- [ ] Open Graph tags configured
- [ ] Twitter Card tags configured
- [ ] Favicon/logo configured
- [ ] Viewport meta tag present
- [ ] Schema.org markup added (optional)

---

## Post-Deployment Phase

### 16. Monitoring Setup
- [ ] Analytics configured in Netlify
- [ ] Error tracking enabled
- [ ] Deploy notifications configured
- [ ] Build failure emails enabled
- [ ] Slack integration (optional)
- [ ] Monitoring dashboard reviewed

### 17. Backup & Rollback
- [ ] Deployment history reviewed
- [ ] Rollback procedure understood
- [ ] Previous deployment available for rollback
- [ ] Version control history maintained

### 18. Documentation
- [ ] README.md updated with deployment info
- [ ] NETLIFY_DEPLOYMENT.md in repository
- [ ] API documentation available
- [ ] Team members informed
- [ ] Deployment process documented
- [ ] Access credentials shared securely

### 19. Team Communication
- [ ] Deployment announcement sent
- [ ] Live URL shared with team
- [ ] User feedback channel established
- [ ] Bug report process documented
- [ ] Support contacts provided

---

## Ongoing Maintenance

### 20. Post-Launch Monitoring
- [ ] Monitor error rates daily for first week
- [ ] Check analytics for unusual patterns
- [ ] Review user feedback
- [ ] Monitor API performance
- [ ] Check uptime/downtime
- [ ] Review logs for issues

### 21. Continuous Deployment
- [ ] Auto-deploy on push enabled
- [ ] Branch protection rules enforced
- [ ] Pull request previews enabled
- [ ] Deploy previews reviewed before merging
- [ ] Release notes maintained

### 22. Updates & Patches
- [ ] Security updates applied promptly
- [ ] Dependency updates planned
- [ ] Testing performed for updates
- [ ] Changelog maintained
- [ ] Version numbering consistent

---

## Quick Reference: Commands

### Build & Test Locally
```bash
npm install          # Install dependencies
npm run dev         # Development server
npm run build       # Production build
npm run preview     # Preview production build
npm run lint        # Linting check
```

### Deployment
```bash
git add .
git commit -m "message"
git push origin main
# Netlify auto-deploys on push
```

### Rollback
```bash
# In Netlify Dashboard:
# 1. Go to Deploys
# 2. Find previous stable version
# 3. Click ... → Publish deploy
```

---

## Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Build fails | Check [build logs in Netlify](https://app.netlify.com/) dashboard |
| Routes not working | Verify SPA rewrite rules in `netlify.toml` |
| Env variables not loading | Variables must start with `VITE_` |
| API calls failing | Check CORS and `VITE_API_URL` environment variable |
| CSS not loading | Check cache, hard refresh browser (Ctrl+Shift+R) |
| Images broken | Verify image paths are relative to `dist/` |
| Mobile not responsive | Test in browser dev tools mobile view |

---

## Success Criteria

✅ **Your deployment is successful when:**
1. Netlify shows "Deploy successful" with green status
2. Live URL is accessible and loads without errors
3. All pages and routes work correctly
4. No console errors or warnings
5. Forms submit successfully
6. API calls return correct data
7. Mobile view is responsive
8. Performance metrics are acceptable
9. Security headers present in response
10. Team can access and use the application

---

**Last Updated**: February 2026  
**Status**: Ready for Deployment ✅

For support: See NETLIFY_DEPLOYMENT.md or contact your development team.
