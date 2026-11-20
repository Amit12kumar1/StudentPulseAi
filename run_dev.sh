#!/usr/bin/env bash
# StudentPulse AI - Byte Force Local Startup Script

echo "=========================================================="
echo " Starting StudentPulse AI (Team Byte Force)"
echo " Core Philosophy: Evidence -> Insight -> Action"
echo "=========================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 1. Start Backend
echo "Starting FastAPI Backend on http://localhost:8000 ..."
cd "$SCRIPT_DIR/backend"
PYTHONPATH=. "$SCRIPT_DIR/venv/bin/uvicorn" app.main:app --port 8000 &
BACKEND_PID=$!

# 2. Start Frontend
echo "Starting Vite Frontend on http://localhost:5173 ..."
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM EXIT

wait

