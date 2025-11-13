# Deployment Guide - Knowledge Graph System

This guide covers various deployment options for the Knowledge Graph System.

## Table of Contents
- [Quick Start](#quick-start)
- [Local Development](#local-development)
- [Vercel Deployment](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [Self-Hosting](#self-hosting)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git
- Gemini API Key (get from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Fast Setup

#### Windows
```batch
git clone https://github.com/Coldaine/KnowledgeGraphSystem.git
cd KnowledgeGraphSystem
startup.bat
```

#### Linux/Mac
```bash
git clone https://github.com/Coldaine/KnowledgeGraphSystem.git
cd KnowledgeGraphSystem
chmod +x startup.sh
./startup.sh
```

The application will be available at `http://localhost:3000`

## Local Development

### Manual Setup

1. **Clone the repository**
```bash
git clone https://github.com/Coldaine/KnowledgeGraphSystem.git
cd KnowledgeGraphSystem
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

4. **Run development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
npm run start
```

### Using Sample Data

The application includes sample data to demonstrate features. To load it:

1. Open the application in your browser
2. Open the browser console (F12)
3. Run:
```javascript
import { loadSampleData } from './src/lib/sampleData';
import { useBlockStore } from './src/stores/blockStore';
loadSampleData(useBlockStore.getState());
```

## Vercel Deployment

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FColdaine%2FKnowledgeGraphSystem&env=NEXT_PUBLIC_GEMINI_API_KEY&envDescription=Gemini%20API%20Key%20for%20LLM%20features&envLink=https%3A%2F%2Fmakersuite.google.com%2Fapp%2Fapikey&project-name=knowledge-graph-system&repository-name=knowledge-graph-system)

### Manual Vercel Setup

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Set environment variables**
```bash
vercel env add NEXT_PUBLIC_GEMINI_API_KEY
```

4. **Deploy to production**
```bash
vercel --prod
```

### Vercel Dashboard Setup

1. Go to [vercel.com](https://vercel.com)
2. Import the GitHub repository
3. Add environment variable:
   - Name: `NEXT_PUBLIC_GEMINI_API_KEY`
   - Value: Your Gemini API key
4. Click "Deploy"

## Docker Deployment

### Using Docker Compose

1. **Create `docker-compose.yml`**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_GEMINI_API_KEY=${GEMINI_API_KEY}
    volumes:
      - ./data:/app/data
```

2. **Create `Dockerfile`**
```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

3. **Build and run**
```bash
docker-compose up --build
```

### Using Docker (without Compose)

```bash
# Build
docker build -t knowledge-graph .

# Run
docker run -p 3000:3000 -e NEXT_PUBLIC_GEMINI_API_KEY=your_key knowledge-graph
```

## Self-Hosting

### On a VPS (Ubuntu/Debian)

1. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Install PM2**
```bash
sudo npm install -g pm2
```

3. **Clone and setup**
```bash
git clone https://github.com/Coldaine/KnowledgeGraphSystem.git
cd KnowledgeGraphSystem
npm install
npm run build
```

4. **Create ecosystem file**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'knowledge-graph',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_PUBLIC_GEMINI_API_KEY: 'your_key_here'
    }
  }]
}
```

5. **Start with PM2**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Using Nginx Reverse Proxy

1. **Install Nginx**
```bash
sudo apt-get install nginx
```

2. **Configure Nginx**
```nginx
# /etc/nginx/sites-available/knowledge-graph
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **Enable site**
```bash
sudo ln -s /etc/nginx/sites-available/knowledge-graph /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL with Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | Gemini API key for LLM features | `AIzaSy...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Knowledge Graph System` |
| `NEXT_PUBLIC_APP_VERSION` | Version | `0.1.0` |
| `NEO4J_URI` | Neo4j database URI (future) | - |
| `NEO4J_USER` | Neo4j username (future) | - |
| `NEO4J_PASSWORD` | Neo4j password (future) | - |

## Troubleshooting

### Common Issues

#### 1. "Module not found" errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

#### 2. Port 3000 already in use
```bash
# Find process using port
lsof -i :3000
# or on Windows
netstat -ano | findstr :3000

# Kill process or use different port
PORT=3001 npm run start
```

#### 3. Build fails with memory error
```bash
# Increase Node memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### 4. Gemini API key not working
- Ensure the key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Check that the key has proper permissions
- Verify the key is correctly set in `.env.local`

#### 5. Blank page after deployment
- Check browser console for errors
- Ensure all environment variables are set
- Verify build succeeded without errors
- Check network tab for failed API calls

### Performance Optimization

#### 1. Enable caching
Add to `next.config.js`:
```javascript
module.exports = {
  // ... existing config
  staticPageGenerationTimeout: 100,
  compress: true,
}
```

#### 2. Use CDN for static assets
Configure Vercel or Cloudflare CDN for static file serving.

#### 3. Database optimization (future)
When Neo4j is integrated:
- Index frequently queried fields
- Limit traversal depth
- Use pagination for large result sets

### Monitoring

#### Using Vercel Analytics
```bash
npm install @vercel/analytics
```

Add to `_app.tsx`:
```javascript
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

#### Self-hosted monitoring
- Use PM2 monitoring: `pm2 monit`
- Set up Grafana + Prometheus
- Use application insights

## Support

### Getting Help
- Open an issue on [GitHub](https://github.com/Coldaine/KnowledgeGraphSystem/issues)
- Check existing issues for solutions
- Review the [README](README.md) for features

### Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License
MIT License - See [LICENSE](LICENSE) for details.