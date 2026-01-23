# Gemini 3 Flash Integration Guide

**Updated:** January 2026
**Model:** `gemini-3-flash`
**SDK:** `@google/genai` v1.37.0

## Overview

This project uses **Gemini 3 Flash**, Google's latest AI model optimized for speed and cost-efficiency. It provides frontier-class intelligence at a fraction of the cost of larger models.

## Pricing (2026)

- **Input tokens**: $0.50 per 1M tokens
- **Output tokens**: $3.00 per 1M tokens
- **Audio input**: $1.00 per 1M tokens

## Thinking Levels

Gemini 3 Flash supports adjustable reasoning depth via the `thinkingLevel` parameter:

| Level | Use Case | Performance | Cost |
|-------|----------|-------------|------|
| `minimal` | Basic retrieval, simple queries | Fastest | Lowest |
| `low` | Document chunking, tagging | Fast | Low |
| `medium` | Relationship inference, analysis | Balanced | Medium |
| `high` | Complex reasoning, planning | Slower | Higher |

## Setup

### 1. Install Dependencies

```bash
npm install @google/genai
```

### 2. Get API Key

Visit [Google AI Studio](https://ai.google.dev/) and create a new API key.

### 3. Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Add your API key:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

## Usage Examples

### Basic Document Chunking (Low Thinking)

```typescript
import { LLMChunker } from '@/lib/llm/chunking';
import { ThinkingLevel } from '@/types';

const chunker = new LLMChunker(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

const result = await chunker.ingestDocument(documentContent, {
  source: 'document.md',
  chunkingStrategy: 'semantic',
  extractTags: true,
  inferRelationships: true,
  generateSummary: true,
  thinkingLevel: ThinkingLevel.LOW, // Fast and cheap for chunking
  requireApproval: false,
});
```

### Complex Analysis (High Thinking)

```typescript
const result = await chunker.ingestDocument(technicalSpec, {
  source: 'architecture-spec.md',
  chunkingStrategy: 'hybrid',
  extractTags: true,
  inferRelationships: true,
  generateSummary: true,
  thinkingLevel: ThinkingLevel.HIGH, // Deep reasoning for complex docs
  requireApproval: true,
  confidenceThreshold: 0.8,
});
```

### Quick Retrieval (Minimal Thinking)

```typescript
const result = await chunker.ingestDocument(simpleNote, {
  source: 'meeting-notes.txt',
  chunkingStrategy: 'structural',
  extractTags: false,
  inferRelationships: false,
  generateSummary: false,
  thinkingLevel: ThinkingLevel.MINIMAL, // Blazing fast for simple tasks
  requireApproval: false,
});
```

## Default Behavior

If no `thinkingLevel` is specified, the system defaults to `ThinkingLevel.LOW` for document chunking - providing a good balance of speed and quality for typical use cases.

## Model Capabilities

Gemini 3 Flash supports:
- ✅ 1M token context window
- ✅ Multimodal inputs (text, images, audio, video, PDFs)
- ✅ Function calling / tool use
- ✅ Streaming responses
- ✅ JSON mode for structured outputs

## Performance Tips

1. **Use `minimal` or `low` for batch operations** - Maximize throughput for large document sets
2. **Use `medium` for interactive features** - Good UX with reasonable cost
3. **Use `high` only when necessary** - Reserve for complex reasoning tasks
4. **Enable streaming for better UX** - Users see results incrementally
5. **Cache common prompts** - Reduce costs for repeated operations

## Migration from Older Models

If you were using Gemini 2.0 or 2.5 Flash:

### Before (Deprecated)
```typescript
// Old SDK - deprecated
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-latest'
});
```

### After (Current - 2026)
```typescript
// New SDK - current
import { GoogleGenerativeAI } from '@google/genai';

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: 'gemini-3-flash'
});

// With thinking level control
const result = await model.generateContent({
  contents: [...],
  generationConfig: {
    thinkingLevel: 'low', // New in Gemini 3!
  },
});
```

## Resources

- **API Documentation**: https://ai.google.dev/gemini-api/docs/gemini-3
- **SDK GitHub**: https://github.com/googleapis/js-genai
- **NPM Package**: https://www.npmjs.com/package/@google/genai
- **Pricing**: https://ai.google.dev/pricing
- **Model Card**: https://deepmind.google/models/gemini/flash/

## Future Model Tiers

The system is designed to support multiple model tiers:

```typescript
// Future: Model selection based on task complexity
export enum ModelTier {
  SMALL = 'gemini-3-flash',      // Current default
  MEDIUM = 'gemini-3-pro',        // For complex reasoning
  LARGE = 'gemini-3-ultra',       // For frontier tasks
}
```

For now, Gemini 3 Flash with adjustable thinking levels provides excellent performance across all use cases.
