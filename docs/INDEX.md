# Growing Collective Documentation

## Quick Navigation

### Core Files (Root)
- **README.md** - Project overview and getting started
- **CLAUDE.md** - Auto-loaded context for Claude Code

### Analysis (docs/analysis/)
Documentation comparing growing_collective with dumbdown_collective patterns:

- **README_ANALYSIS.md** - Start here: 5-minute orientation
- **DUMBDOWN_PATTERNS_INDEX.md** - Pattern catalog and quick reference
- **ALIGNMENT_SUMMARY.md** - Gap analysis: what's missing, what's good
- **DUMBDOWN_MIGRATION_ANALYSIS.md** - Complete technical deep dive (2 hours)
- **COMPARISON.md** - Side-by-side comparison

### Guides (docs/guides/)
How-to documentation:

- **MIGRATION_QUICK_REFERENCE.md** - Step-by-step migration guide
- **QUICKSTART.md** - Quick start guide
- **ROUTER_SETUP.md** - Router configuration guide
- **TOOLS_GUIDE.md** - Custom tools implementation guide
- **TOOLS_README.md** - Tools quick reference

### Archive (docs/archive/)
Historical/reference files:

- **DEMO_TIME_AGENT.md** - Time agent demo
- **TOOLS_IMPLEMENTATION_SUMMARY.md** - Tools implementation notes
- **INDEX.md** - Old index file

## Recommended Reading Order

### If you want to understand the project (15 min):
1. README.md (root)
2. docs/analysis/README_ANALYSIS.md
3. docs/analysis/DUMBDOWN_PATTERNS_INDEX.md

### If you want to implement dumbdown patterns (1 hour):
1. docs/analysis/ALIGNMENT_SUMMARY.md
2. docs/guides/MIGRATION_QUICK_REFERENCE.md
3. Start implementing Phase 1

### If you want deep technical understanding (3+ hours):
1. All of the above
2. docs/analysis/DUMBDOWN_MIGRATION_ANALYSIS.md
3. Explore dumbdown_collective source code

## Directory Structure

```
growing_collective/
├── CLAUDE.md                    # Auto-loaded context
├── README.md                    # Main documentation
├── docs/
│   ├── INDEX.md                # This file
│   ├── analysis/               # Comparison & analysis
│   ├── guides/                 # How-to guides
│   └── archive/                # Historical files
├── .claude/
│   ├── agents/                 # Agent definitions
│   ├── commands/               # Custom commands
│   └── tools/                  # Custom tools
└── .claude-collective/         # (Future) Dumbdown patterns
```
