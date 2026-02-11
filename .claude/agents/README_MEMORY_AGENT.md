# Memory Agent - Setup Complete

## Summary

Created a new **memory-agent** that bridges the Growing Collective with the letto memory system. This agent provides semantic search with time-decay ranking for runtime artifacts.

## What Was Created

### 1. Agent Definition

**File**: `/home/adamsl/growing_collective/.claude/agents/memory-agent.md`

- 420 lines of comprehensive documentation
- YAML frontmatter with metadata
- Follows Growing Collective agent pattern
- Complete command reference for all letto operations

### 2. Agent Catalog Entry

**File**: `/home/adamsl/growing_collective/.claude-collective/AGENTS.md`

- Added memory-agent to the agent catalog
- Documented routing through semantic-router-agent
- Listed key capabilities and integration points

## Agent Capabilities

The memory-agent can:

1. **Log runtime artifacts** (errors, fixes, decisions, gotchas, performance issues, deployments)
2. **Search artifacts** using semantic similarity + time-decay ranking
3. **Track dependencies** and version conflicts
4. **Monitor performance** issues with metrics
5. **Document deployments** with rollback information

## Integration Points

### With Growing Collective

- Routes through semantic-router-agent using AI-powered intent detection
- Other agents can delegate memory tasks: `Use the memory-agent subagent to...`
- Follows standard Growing Collective agent patterns

### With Letto System

- **Letto CLI**: `/home/adamsl/planner/main.py`
- **ChromaDB storage**: Semantic embeddings with vector search
- **Time-decay ranking**: Recent + relevant artifacts surface first
- **Artifact types**: 20+ types (error, fix, decision, gotcha, performance, etc.)

## Usage Examples

### Log an error:

```bash
python3 /home/adamsl/planner/main.py artifact \
  "TypeError: Cannot read property 'on' of undefined" \
  error \
  pytest \
  --file-path="path/to/file.py" \
  --project="my_project"
```

### Search for similar issues:

```bash
python3 /home/adamsl/planner/main.py search-artifacts "parser error" \
  --artifact-type="error"
```

### Log a gotcha:

```bash
python3 /home/adamsl/planner/main.py gotcha \
  "ChromaDB requires \$and operator for multiple filters" \
  "Use {'\$and': [{'a': '1'}, {'b': '2'}]} syntax"
```

## How Time-Decay Ranking Works

```
score = (semantic_similarity * 0.70) + (recency * 0.25) + tag_boost

where:
  semantic_similarity = ChromaDB vector distance
  recency = exp(-0.1 * days_old / 7)  # newer = higher
  tag_boost = +0.10 for error/fix/decision/test_failure
```

## Next Steps

### To Use the Agent:

1. **Route requests**: `/van log this error: [error message]`
2. **Semantic routing**: The router will automatically detect memory-related intent
3. **Direct delegation**: Other agents can delegate to memory-agent

### Prerequisites:

- Letto CLI dependencies must be installed in `/home/adamsl/planner/`
- ChromaDB storage should be initialized
- Python 3 environment with required packages (typer, chromadb, sentence-transformers)

## File Locations

- **Agent definition**: `/home/adamsl/growing_collective/.claude/agents/memory-agent.md`
- **Catalog entry**: `/home/adamsl/growing_collective/.claude-collective/AGENTS.md`
- **Letto CLI**: `/home/adamsl/planner/main.py`
- **Letto docs**: `/home/adamsl/growing_collective/letto_workspace/docs/`
- **Memory bridge**: `/home/adamsl/growing_collective/letto_workspace/memory_bridge/main.py`

## Architecture

```
User Request ("log this error")
     ↓
/van Command
     ↓
semantic-router-agent (Gemini AI)
     ↓
Detects "memory" intent
     ↓
Task Tool → memory-agent
     ↓
Executes: python3 /home/adamsl/planner/main.py artifact ...
     ↓
Letto stores in ChromaDB with embeddings
     ↓
Returns confirmation to user
```

## Key Features

1. **AI-Powered Routing**: No keywords needed - semantic router understands intent
2. **Time-Aware**: Recent artifacts rank higher automatically
3. **Semantic Search**: Finds conceptually similar issues, not just keyword matches
4. **Multi-Project**: Track artifacts across multiple projects
5. **Flexible Types**: 20+ artifact types for different use cases
6. **Integration Ready**: Works with CI/CD, monitoring, and manual workflows

## Testing the Agent

Once letto dependencies are installed, test with:

```bash
# Route through Growing Collective
/van log an error about parser issues

# Direct test of letto CLI
python3 /home/adamsl/planner/main.py status

# Search test
python3 /home/adamsl/planner/main.py search-artifacts "test query"
```

---

**Status**: Agent created and documented ✅
**Integration**: Ready for semantic routing ✅
**Dependencies**: Letto CLI needs dependencies installed ⚠️
