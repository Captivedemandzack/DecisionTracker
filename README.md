# Captive Demand — Change Tracker

Internal accountability tool for tracking client change requests across Mantality Health, Agentis, and Arete.

---

## Deploy to Netlify (step by step)

### 1. Push to GitHub
Create a new private GitHub repo and push this folder to it.

### 2. Connect to Netlify
- Go to netlify.com → Add new site → Import from Git
- Select your GitHub repo
- Build command: `npm run build`
- Publish directory: `dist`
- Click Deploy

### 3. Add your Anthropic API key
- In Netlify dashboard → Site configuration → Environment variables
- Add variable: `ANTHROPIC_API_KEY` = your key from console.anthropic.com
- Redeploy the site

That's it. The Netlify Function at `/api/claude` will proxy all AI requests
using your key without ever exposing it to the browser.

---

## How data is stored

All data lives in **localStorage** in the browser. This means:
- Data persists between sessions on the same browser/device
- Each team member on a different device starts fresh (by design for an internal tool)
- If you want shared data across devices later, swap localStorage for Supabase

---

## Local development

```bash
npm install
npm run dev
```

For local dev, create a `.env` file:
```
ANTHROPIC_API_KEY=sk-ant-...
```

Then run Netlify CLI to test functions locally:
```bash
npm install -g netlify-cli
netlify dev
```
