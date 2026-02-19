#!/bin/bash

# Uzhavu SEI Portal - Pre-Deployment Verification Script
# This script checks if your project is ready for Netlify deployment

echo "🚀 Uzhavu SEI Portal - Deployment Verification"
echo "=============================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counter
checks_passed=0
checks_failed=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        ((checks_passed++))
    else
        echo -e "${RED}✗${NC} $1 NOT found"
        ((checks_failed++))
    fi
}

# Function to check directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/ exists"
        ((checks_passed++))
    else
        echo -e "${RED}✗${NC} $1/ NOT found"
        ((checks_failed++))
    fi
}

echo "📋 Checking project structure..."
echo ""

# Check essential files
check_file "package.json"
check_file "vite.config.js"
check_file "index.html"
check_file "netlify.toml"
check_file ".env.example"
check_file ".env.production"
check_file ".env.development"
check_file "README.md"
check_file "NETLIFY_DEPLOYMENT.md"

echo ""
echo "📁 Checking directories..."
echo ""

# Check essential directories
check_dir "src"
check_dir "public"
check_dir "node_modules"

echo ""
echo "🔍 Checking dependencies..."
echo ""

# Check if key dependencies exist in package.json
if grep -q "\"react\"" package.json; then
    echo -e "${GREEN}✓${NC} React dependency found"
    ((checks_passed++))
else
    echo -e "${RED}✗${NC} React dependency NOT found"
    ((checks_failed++))
fi

if grep -q "\"vite\"" package.json; then
    echo -e "${GREEN}✓${NC} Vite dependency found"
    ((checks_passed++))
else
    echo -e "${RED}✗${NC} Vite dependency NOT found"
    ((checks_failed++))
fi

if grep -q "\"react-router-dom\"" package.json; then
    echo -e "${GREEN}✓${NC} React Router dependency found"
    ((checks_passed++))
else
    echo -e "${RED}✗${NC} React Router dependency NOT found"
    ((checks_failed++))
fi

echo ""
echo "🛠️  Checking build scripts..."
echo ""

if grep -q "\"build\":" package.json; then
    echo -e "${GREEN}✓${NC} Build script configured"
    ((checks_passed++))
else
    echo -e "${RED}✗${NC} Build script NOT found"
    ((checks_failed++))
fi

if grep -q "\"dev\":" package.json; then
    echo -e "${GREEN}✓${NC} Dev script configured"
    ((checks_passed++))
else
    echo -e "${RED}✗${NC} Dev script NOT found"
    ((checks_failed++))
fi

echo ""
echo "📦 Checking Netlify configuration..."
echo ""

if grep -q "command = \"npm run build\"" netlify.toml; then
    echo -e "${GREEN}✓${NC} Build command configured in netlify.toml"
    ((checks_passed++))
else
    echo -e "${RED}✗${NC} Build command NOT configured"
    ((checks_failed++))
fi

if grep -q "publish = \"dist\"" netlify.toml; then
    echo -e "${GREEN}✓${NC} Publish directory configured"
    ((checks_passed++))
else
    echo -e "${RED}✗${NC} Publish directory NOT configured"
    ((checks_failed++))
fi

if grep -q "from = \"\/\*\"" netlify.toml; then
    echo -e "${GREEN}✓${NC} SPA rewrite rules configured"
    ((checks_passed++))
else
    echo -e "${RED}✗${NC} SPA rewrite rules NOT configured"
    ((checks_failed++))
fi

echo ""
echo "=============================================="
echo ""
echo -e "Results: ${GREEN}$checks_passed passed${NC}, ${RED}$checks_failed failed${NC}"
echo ""

if [ $checks_failed -eq 0 ]; then
    echo -e "${GREEN}✓ Your project is ready for Netlify deployment!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Commit your changes: git add . && git commit -m 'Deploy: Netlify configuration'"
    echo "2. Push to GitHub: git push origin main"
    echo "3. Go to https://app.netlify.com"
    echo "4. Click 'New site from Git' and select your repository"
    echo "5. Build settings are pre-configured in netlify.toml"
    echo "6. Add environment variables in Site settings > Build & deploy > Environment"
    echo "7. Trigger the build!"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Please fix the above issues before deploying${NC}"
    echo ""
    exit 1
fi
