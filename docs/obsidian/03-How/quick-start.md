---
title: Quick Start
tags: [#kg/how/usage]
---

# Quick Start {#quickstart}

From [[repos/KnowledgeGraphSystem/DEPLOYMENT.md|Deployment.md]]

## Local Dev
```bash
git clone https://github.com/Coldaine/KnowledgeGraphSystem.git
cd KnowledgeGraphSystem
npm install
cp .env.example .env.local
# Edit: NEXT_PUBLIC_GEMINI_API_KEY=$(bws secret get GEMINI_API_KEY)
npm run dev
```
Open http://localhost:3000

## Load Sample
Browser console:
```js
// From src/lib/sampleData
import { loadSampleData } from '../lib/sampleData';
loadSampleData(useBlockStore.getState());
```

> [!workflow] Typical Session  
> 1. Quick start  
> 2. Load sample  
> 3. Interact graph (drag, flip blocks)  
> 4. Create block → link rels  
> 5. Assemble doc from root  
> 6. Export MD

## Secrets Mgmt {#secrets}
- Dev: `.env.local`  
- Prod: Vercel env vars  
- Secure: `bws secret get GEMINI_API_KEY | jq -r .value`

