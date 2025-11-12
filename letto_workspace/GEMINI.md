# Project Overview

This project provides a "Memory Block Manager" agent for the Letta IDE. The agent is designed to help developers capture and retrieve runtime artifacts such as errors, fixes, decisions, and performance issues. It uses a ChromaDB-backed memory system with time-decay ranking to surface the most relevant information.

The project consists of three main parts:
1.  **Agent Definition (`agents/memory_block.af`):** A JSON file that defines the agent's persona, tools, and configuration for use in the Letta IDE.
2.  **Memory Bridge (`memory_bridge/main.py`):** A command-line interface (CLI) for synchronizing the local memory system with a shared, server-based memory system provided by Letta.
3.  **Documentation (`docs/`):** Contains detailed information about the agent, its usage, and the memory block system.

## Building and Running

This is a Python-based project. The following commands are inferred from the project's documentation and files.

### Installation

The project requires `letta` and other Python packages.

```bash
pip install letta chromadb sentence-transformers
```

### Running the Memory Bridge CLI

The `memory_bridge/main.py` script provides a CLI for interacting with the memory system.

**Set Environment Variables:**
```bash
export PYTHONPATH=/home/adamsl/planner
export CHROMADB_PATH=./storage/chromadb
```

**Sync local memory to Letta:**
```bash
python3 memory_bridge/main.py sync
```

**List memory blocks:**
```bash
python3 memory_bridge/main.py list
```

**Search memory blocks:**
```bash
python3 memory_bridge/main.py search "your query"
```

### Using the Agent in Letta IDE

1.  **Launch Letta ADE**:
    ```bash
    letta run
    ```
2.  **Import the Agent File**:
    *   In the ADE interface, click "Import Agent"
    *   Select `agents/memory_block.af`

## Development Conventions

*   **Memory System:** The core of the project is the `rag_system`, which uses ChromaDB for storage and a `DocumentManager` class to manage artifacts.
*   **Agent Tools:** The agent's tools are defined in `agents/memory_block.af` and are implemented as Python functions that interact with the `rag_system`.
*   **CLI:** The `memory_bridge/main.py` script uses the `argparse` and `rich` libraries to provide a user-friendly command-line interface.
*   **Modularity:** The project is organized into distinct modules for the agent, the memory bridge, and documentation.
