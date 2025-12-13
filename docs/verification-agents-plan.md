# Knowledge Verification Agents Implementation Plan

## Phase 1: MVP (2 weeks)

**Goal**: Verify 10 FAST decay blocks (PyPI/npm versions)

**Data Model Extension**
```typescript
interface Block {
  // ... existing
  decayCategory: 'FAST' | 'MEDIUM' | 'SLOW' | 'NONE';
  ttlDays?: number;
  verifiedAt?: Date;
  confidenceScore: 0.0 | 1.0; // Binary for MVP
  lastApiSource?: string;
}
```

**Agent Code (LangGraph + Qwen2.5-1.5B)**
```python
from langgraph.graph import StateGraph
from lmstudio import LMStudioClient

llm = LMStudioClient(model='qwen2.5-1.5b-instruct-q4')

def verify_pypi(state):
    package = state['block']['topic']
    resp = httpx.get(f'https://pypi.org/pypi/{package}/json')
    latest = resp.json()['info']['version']
    stale = parse(resp.json()['releases'][latest][0]['upload_time']) < datetime.now() - timedelta(days=30)
    return {'stale': stale, 'latestVersion': latest}

graph = StateGraph()
graph.add_node('pypi_verify', verify_pypi)
graph.add_node('llm_judge', lambda state: llm.chat(f"Is {state['block']['version']} vs {state['latestVersion']} stale?"))
```

**Scheduling**
```bash
# cron weekly
0 2 * * 1 python verify_fast_decay.py --db neo4j://localhost
```

## Phase 2: Medium Decay (4 weeks)

Add GitHub API, HuggingFace. Use parallel verification with asyncio.Semaphore(10).

## Phase 3: Full Automation (8 weeks)

- MCP server endpoint `/api/verify/{blockId}`
- Dashboard with stale queue
- Confidence decay: score *= 0.99^weeks_since_verify

**Cost**: $0.05/week (500 blocks x $0.0001/query)

**Success Metrics**:
- 95% FAST knowledge verified weekly
- <5% false positives
- 80% confidence on verified knowledge
