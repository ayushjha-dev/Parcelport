#!/bin/bash

# ParcelPort E2E Test Runner
# This script helps you run the interconnection tests easily

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         ParcelPort Interconnection Test Runner            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.7 or higher."
    exit 1
fi

# Use python3 if available, otherwise python
PYTHON_CMD="python3"
if ! command -v python3 &> /dev/null; then
    PYTHON_CMD="python"
fi

echo "✓ Python found: $($PYTHON_CMD --version)"

# Check if Playwright is installed
if ! $PYTHON_CMD -c "import playwright" 2>/dev/null; then
    echo ""
    echo "⚠️  Playwright is not installed."
    echo ""
    read -p "Would you like to install it now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Installing Playwright..."
        pip install playwright
        playwright install
        echo "✓ Playwright installed successfully"
    else
        echo "❌ Cannot run tests without Playwright. Exiting."
        exit 1
    fi
else
    echo "✓ Playwright is installed"
fi

# Check if dev server is running
echo ""
echo "Checking if dev server is running..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✓ Dev server is running at http://localhost:3000"
else
    echo "❌ Dev server is not running!"
    echo ""
    echo "Please start the dev server in another terminal:"
    echo "  npm run dev"
    echo ""
    read -p "Press ENTER when the server is ready..."
fi

# Create screenshots directory if it doesn't exist
if [ ! -d "screenshots" ]; then
    mkdir screenshots
    echo "✓ Created screenshots directory"
fi

# Show test options
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Select Test Type                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "1) Interconnection Test (Recommended) - ~2-3 minutes"
echo "   Tests: Student → Admin → Staff connections"
echo ""
echo "2) Full Workflow Test - ~4-5 minutes"
echo "   Tests: Complete parcel lifecycle with all steps"
echo ""
echo "3) Authentication Test - ~1-2 minutes"
echo "   Tests: User registration and login"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "Running Interconnection Test..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        $PYTHON_CMD scripts/interconnection-test.py
        ;;
    2)
        echo ""
        echo "Running Full Workflow Test..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        $PYTHON_CMD scripts/full-workflow-e2e.py
        ;;
    3)
        echo ""
        echo "Running Authentication Test..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        $PYTHON_CMD scripts/auth-e2e.py
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test completed!"
echo ""
echo "📸 Screenshots saved in: screenshots/"
echo ""
echo "To run again: ./scripts/run-test.sh"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
