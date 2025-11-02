#!/bin/bash

echo "=========================================="
echo "Starting Flask Backend for Legal Analyzer"
echo "=========================================="

cd backend

echo ""
echo "Checking Python dependencies..."
if ! python -c "import flask" 2>/dev/null; then
    echo "⚠️  Flask not found. Installing dependencies..."
    pip install -r requirements.txt
fi

echo ""
echo "=========================================="
echo "Starting Flask server..."
echo "=========================================="
echo ""
echo "The backend will:"
echo "  1. Load Legal-BERT models (5-10 seconds)"
echo "  2. Train on legal data (5 seconds)"
echo "  3. Start server on port 5000"
echo ""
echo "When you see 'Running on http://127.0.0.1:5000'"
echo "the backend is ready!"
echo ""
echo "Press Ctrl+C to stop"
echo "=========================================="
echo ""

python app.py
