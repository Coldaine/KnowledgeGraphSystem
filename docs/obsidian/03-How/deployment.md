---
title: Deployment Guide
tags: [#kg/how/deploy]
---

# Deployment {#deployment}

Full guide: [[repos/KnowledgeGraphSystem/DEPLOYMENT.md|Original]]

## Options Table
| Method | Ease | Scale | Cost |
|--------|------|-------|------|
| Local | Easy | Personal | Free |
| Vercel | 1-click | Medium | Free tier |
| Docker | Medium | Container | Free |
| VPS/PM2 | Hard | High | $5/mo |

> [!protip] Vercel  
> [![Vercel](file '../DEPLOYMENT.md' image)] One-click w/ Gemini key prompt.

## Env Vars {#env}
| Var | Req | Desc |
|-----|-----|------|
| NEXT_PUBLIC_GEMINI_API_KEY | Yes | LLM |

**Prod Secrets**: Bitwarden → env vars, never commit.

> [!todo] Self-host: Nginx + SSL (Certbot)

