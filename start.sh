#!/bin/bash
# Start script for Railway deployment

# Install dependencies if needed
if [ ! -d "venv" ]; then
    python -m venv venv
fi

source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Start the server
python -m uvicorn server.main:app --host 0.0.0.0 --port ${PORT:-8000}
