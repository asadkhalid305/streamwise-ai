# Deployment Guide

## Deploying to Vercel

This application is optimized for Vercel deployment with full Next.js support.

### Quick Deploy (Recommended)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**

   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel auto-detects Next.js configuration

3. **Configure Environment Variables (Optional)**

   **Option A: Shared API Key (You pay for all users)**

   - Add environment variable: `OPENAI_API_KEY` = `sk-proj-...`
   - Add environment variable: `OPENAI_DEFAULT_MODEL` = `gpt-4.1-mini`
   - Users won't see the API key modal

   **Option B: User-Provided Keys (Each user pays)**

   - Don't add any environment variables
   - Users will be prompted to enter their own API key
   - More cost-effective for public apps

   **Option C: Subdirectory Deployment (Advanced)**

   If deploying this app under a subdirectory path via rewrites from another domain:

   - Add environment variable: `NEXT_PUBLIC_BASE_PATH` = `/apps/movie-and-series-picker`
   - This ensures all assets and routes work correctly when served from a subpath
   - Example: Serving at `yourdomain.com/apps/movie-and-series-picker` instead of root
   - Not needed for standard standalone deployments

4. **Deploy**
   - Click "Deploy"
   - Wait ~2 minutes for build
   - Your app is live!

### Environment Variables

| Variable                | Required | Default       | Description                                                                   |
| ----------------------- | -------- | ------------- | ----------------------------------------------------------------------------- |
| `OPENAI_API_KEY`        | No\*     | -             | Your OpenAI API key                                                           |
| `OPENAI_DEFAULT_MODEL`  | No       | `gpt-4.1-mini` | OpenAI model to use                                                           |
| `NEXT_PUBLIC_BASE_PATH` | No       | -             | Base path for subdirectory deployment (e.g., `/apps/movie-and-series-picker`) |

\* Required only if you want to provide a shared key. Otherwise, users provide their own.

**About `NEXT_PUBLIC_BASE_PATH`:**

- Only needed for advanced deployment scenarios where the app is served from a subdirectory
- Example: If your portfolio site at `yourdomain.com` rewrites `/apps/movie-and-series-picker` to this app
- Ensures all JavaScript, CSS, and route links are correctly prefixed
- Leave unset for standard root-level deployments (most users)

### Post-Deployment

1. **Test the deployment**: Visit your Vercel URL
2. **Custom domain**: Add in Vercel project settings
3. **Monitor usage**: Check OpenAI dashboard for API usage
4. **Set spending limits**: Configure on OpenAI platform

### Troubleshooting

**Modal shows even with env var set:**

- Check that `OPENAI_API_KEY` is set in Vercel dashboard
- Redeploy after adding environment variables
- Environment variables must be set in "Production" environment

**API errors:**

- Verify API key is valid on OpenAI platform
- Check API key has sufficient credits
- View logs in Vercel dashboard under "Logs" tab

**Build failures:**

- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility
- Review build logs for specific errors

## Alternative Platforms

### Netlify

While possible, Netlify requires additional configuration for Next.js API routes. Vercel is recommended for better Next.js integration.

### Railway / Render

1. Connect your GitHub repository
2. Set environment variables
3. These platforms auto-detect Next.js
4. Deploy and access via provided URL

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t movie-picker .
docker run -p 3000:3000 -e OPENAI_API_KEY=your_key movie-picker
```

## Security Checklist

Before deploying to production:

- [ ] Added `.env.local` to `.gitignore` (already done)
- [ ] Never committed API keys to version control
- [ ] Set up spending limits on OpenAI dashboard
- [ ] Enabled HTTPS (automatic on Vercel)
- [ ] Reviewed API rate limits
- [ ] Tested with invalid API keys
- [ ] Tested without environment variables (modal flow)

## Cost Optimization

**For public deployments (user-provided keys):**

- No API costs to you
- Users pay for their own usage
- Modal prompts for API key automatically

**For shared key deployments:**

- Monitor usage in OpenAI dashboard
- Set spending alerts
- Consider implementing rate limiting
- Use `gpt-4.1-mini` for cost efficiency

## Monitoring

**Vercel Analytics:**

- Built-in performance monitoring
- View in Vercel dashboard

**OpenAI Usage:**

- Check [platform.openai.com/usage](https://platform.openai.com/usage)
- Set up billing alerts
- Monitor token consumption

## Support

For deployment issues:

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [OpenAI API Documentation](https://platform.openai.com/docs)
