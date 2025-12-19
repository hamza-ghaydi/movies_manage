# Troubleshooting 500 Internal Server Error

If you're getting a 500 error when calling `/api/movies`, follow these steps:

## Step 1: Check Vercel Logs

1. Go to your Vercel dashboard
2. Select your project
3. Click on the "Functions" tab or "Logs" tab
4. Look for error messages related to `/api/movies`

The logs will show the actual error message, which will help identify the issue.

## Step 2: Verify DATABASE_URL Environment Variable

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Make sure `DATABASE_URL` is set
3. The value should look like: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`
4. Make sure it's set for **Production** environment (and Preview if needed)
5. **Redeploy** your application after adding/updating the variable

## Step 3: Verify Database Table Exists

1. Go to your Neon PostgreSQL dashboard
2. Open the SQL Editor
3. Run this query to check if the table exists:
   ```sql
   SELECT EXISTS (
     SELECT FROM information_schema.tables 
     WHERE table_name = 'movies'
   );
   ```
4. If it returns `false`, you need to create the table by running the SQL from `database/schema.sql`

## Step 4: Test Database Connection

You can test your database connection directly:

1. In Neon dashboard, go to SQL Editor
2. Run a simple query:
   ```sql
   SELECT * FROM movies LIMIT 1;
   ```
3. If this fails, the table doesn't exist - run `database/schema.sql`

## Step 5: Common Error Messages

### "DATABASE_URL environment variable is not set"
- **Solution**: Add `DATABASE_URL` in Vercel environment variables and redeploy

### "relation 'movies' does not exist"
- **Solution**: Run the SQL schema from `database/schema.sql` in your Neon database

### "Connection timeout" or "Connection refused"
- **Solution**: Check that your DATABASE_URL is correct and your Neon database is active

### "password authentication failed"
- **Solution**: Verify your DATABASE_URL contains the correct credentials

## Step 6: Local Testing

To test locally before deploying:

```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# Pull environment variables (this creates .env.local)
vercel env pull .env.local

# Run development server
vercel dev
```

Then visit `http://localhost:3000/api/movies` to test.

## Quick Fix Checklist

- [ ] `DATABASE_URL` is set in Vercel environment variables
- [ ] Environment variable is set for the correct environment (Production/Preview)
- [ ] Application was redeployed after adding environment variable
- [ ] `movies` table exists in your Neon database
- [ ] Database connection string is correct
- [ ] Neon database is active (not paused)

## Still Having Issues?

Check the Vercel function logs for the exact error message. The improved error handling will now show more details about what's wrong.

