# OMDb API Key Setup Guide

## The Error You're Seeing

**"OMDb API error: 401 Unauthorized"**

This means the OMDb API key is either:
- Not set in Vercel environment variables
- Invalid or expired
- The fallback key has been rate-limited

## Solution: Get Your Own Free OMDb API Key

### Step 1: Get API Key

1. Go to [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)
2. Choose **"FREE"** (1,000 daily requests)
3. Enter your email address
4. Check your email for the API key
5. Copy the API key (it looks like: `abc123def456`)

### Step 2: Add to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Add:
   - **Key**: `OMDB_API_KEY`
   - **Value**: Your API key from OMDb
   - **Environment**: Select all (Production, Preview, Development)
6. Click **"Save"**

### Step 3: Redeploy

**Important**: Environment variables require a redeploy to take effect!

1. Go to **Deployments** tab
2. Click the three dots (⋯) on the latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger a new deployment

### Step 4: Test

After redeploying, try importing a movie again:
- Go to your app
- Click "Import from IMDb"
- Enter an IMDb ID (e.g., `tt3896198`)
- Click "Import Movie/Series"

## Alternative: Use the Fallback Key (Not Recommended)

The code includes a fallback key (`fb33bf5`), but:
- It may be rate-limited
- It's shared with other users
- You should get your own key for reliability

## Troubleshooting

### Still Getting 401 Error?

1. **Verify the key is set**:
   - Check Vercel Dashboard → Settings → Environment Variables
   - Make sure `OMDB_API_KEY` is there
   - Make sure it's set for the correct environment

2. **Redeploy**:
   - Environment variables only take effect after redeploy
   - Go to Deployments → Redeploy

3. **Check the key**:
   - Make sure you copied the entire key
   - No extra spaces or characters
   - The key should be about 8-10 characters

4. **Test the key**:
   - You can test it directly: `http://www.omdbapi.com/?i=tt3896198&apikey=YOUR_KEY`
   - Replace `YOUR_KEY` with your actual key
   - Should return JSON data, not an error

### Getting 404 Error for `/api/movies/import`?

This means the endpoint isn't deployed. Check:
1. The file exists at `api/movies/import/index.js`
2. You've committed and pushed the file
3. Vercel has deployed the latest version
4. Check Vercel function logs for errors

## Free Tier Limits

The free OMDb API key gives you:
- **1,000 requests per day**
- Basic movie information
- Perfect for personal use

If you need more, consider upgrading to a paid plan.

