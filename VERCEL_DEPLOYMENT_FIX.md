# Fixing Vercel Deployment - JavaScript Instead of JSON Error

## Problem
The API endpoint is returning `text/javascript` with source maps instead of JSON. This typically means:
1. Vercel isn't recognizing the function correctly
2. There's a build/deployment error
3. The function has a syntax error that's causing Vercel to return an error page

## Solution Steps

### 1. Check Vercel Function Logs

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click on **"Functions"** tab
4. Look for `/api/movies` function
5. Check the logs for any errors

### 2. Verify Function Structure

The function should be at: `api/movies/index.js`

It should export a default async function:
```javascript
export default async function handler(req, res) {
  // ...
}
```

### 3. Check Environment Variables

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify `DATABASE_URL` is set
3. Make sure it's set for **Production** environment
4. **Redeploy** after adding/updating environment variables

### 4. Force Redeploy

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click the three dots (⋯) on the latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger a new deployment

### 5. Check Build Logs

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Check the **"Build Logs"** for any errors
4. Look for:
   - Module resolution errors
   - Syntax errors
   - Missing dependencies

### 6. Verify package.json

Make sure `pg` is in `dependencies` (not `devDependencies`):

```json
{
  "dependencies": {
    "pg": "^8.13.1"
  }
}
```

### 7. Test Function Locally

Test with Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run dev server
vercel dev
```

Then test: `http://localhost:3000/api/movies`

### 8. Check Function URL

Make sure you're calling the correct URL:
- Production: `https://your-project.vercel.app/api/movies`
- Not: `https://your-project.vercel.app/api/movies/index.js`

### 9. Verify No Build Errors

Check that your project builds successfully:

```bash
npm run build
```

If there are errors, fix them before deploying.

### 10. Check Vercel Function Runtime

Vercel should automatically detect Node.js functions. If not, you may need to specify in `package.json`:

```json
{
  "engines": {
    "node": "18.x"
  }
}
```

## Common Issues

### Issue: Function returns HTML error page
**Solution**: Check Vercel function logs for the actual error

### Issue: "Module not found" errors
**Solution**: Ensure `pg` is in `dependencies`, not `devDependencies`

### Issue: Environment variable not found
**Solution**: 
1. Add `DATABASE_URL` in Vercel dashboard
2. Redeploy the application
3. Environment variables require a redeploy to take effect

### Issue: Function timeout
**Solution**: Check database connection and query performance

## Quick Test

After redeploying, test the endpoint:

```bash
curl https://your-project.vercel.app/api/movies
```

Should return JSON, not JavaScript.

## Still Not Working?

1. Check Vercel function logs (most important!)
2. Verify the function file is at `api/movies/index.js`
3. Ensure the function exports `export default async function handler(req, res)`
4. Make sure all imports are correct
5. Verify `pg` package is installed and in dependencies



