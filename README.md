# Vercel Yodeck Proxy

A simple Vercel function to proxy Yodeck API calls and bypass CORS restrictions.

## Setup

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy to Vercel:
```bash
cd vercel-proxy
vercel --prod
```

3. Update your SharePoint web part configuration with the deployed URL.

## Usage

The function will be available at: `https://your-project-name.vercel.app/api/yodeck-proxy`

Your SharePoint web part should make requests to this URL instead of directly to Yodeck API.

## Cost

- **Free tier**: 100GB-hrs per month
- **Perfect for your use case**: Lightweight API proxy calls
- **No credit card required** for free tier