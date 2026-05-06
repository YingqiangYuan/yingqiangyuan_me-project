## Development Setup

**Package Managers:**
- Python: uv (via mise)
- Node.js: pnpm (via mise)

**Core Configuration Files:**
- `mise.toml` - Project tasks and tool versions (Python 3.12, Node 24, uv, pnpm)
- `pyproject.toml` - Python dependencies and project metadata
- `package.json` - Node.js dependencies
- `.venv/` - Python virtual environment directory
- `node_modules/` - Node.js dependencies directory

**Python Test Structure:**
- `tests_python/` - Python test files
- Tests run with pytest

**Node.js Test Structure:**
- `tests_node/` - Node.js test files (using Node's built-in test module)
- Tests run with `node --test`

**Available Tasks:**
- `mise run venv-create` - Create Python virtual environment
- `mise run venv-remove` - Remove virtual environment
- `mise run inst-python-deps` - Install Python dependencies
- `mise run inst-node-deps` - Install Node.js dependencies
- `mise run inst` - Install all dependencies (Python + Node.js)
- `mise run test-python` - Run Python tests
- `mise run test-node` - Run Node.js tests
- `mise run test` - Run all tests (Python + Node.js)
- `mise run export` - Export Python requirements to requirements.txt
- `mise run dev` - Start all development servers (Next.js + FastAPI, auto-kills old instances first)
- `mise run kill` - Kill all running development servers
