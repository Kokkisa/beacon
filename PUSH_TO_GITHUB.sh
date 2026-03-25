#!/bin/bash

# Push Beacon to GitHub
# This script authenticates with GitHub and pushes all commits

echo "🔦 Pushing Beacon to GitHub..."
echo ""
echo "To authenticate, you have two options:"
echo ""
echo "Option 1: Personal Access Token (Recommended)"
echo "  1. Go to https://github.com/settings/tokens"
echo "  2. Click 'Generate new token (classic)'"
echo "  3. Select scope 'repo'"
echo "  4. Copy the token"
echo "  5. When prompted for password, paste the token"
echo ""
echo "Option 2: SSH Key"
echo "  1. Go to https://github.com/settings/keys"
echo "  2. Add your SSH public key"
echo "  3. Use SSH URL instead of HTTPS"
echo ""

# Verify we have git
if ! command -v git &> /dev/null; then
    echo "❌ Git not found. Please install git first."
    exit 1
fi

# Check current status
echo "📊 Current git status:"
git log --oneline | head -5
echo ""

# Try to push
echo "🚀 Pushing to GitHub..."
git push -u origin main --force

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Beacon is now on GitHub"
    echo ""
    echo "📍 Repository: https://github.com/nivoratech-commits/beacon"
    echo ""
    echo "Next steps:"
    echo "  1. Go to https://vercel.com"
    echo "  2. Import this GitHub repository"
    echo "  3. Deploy!"
else
    echo ""
    echo "❌ Push failed. Please try one of these:"
    echo ""
    echo "With Personal Access Token:"
    echo "  git push -u origin main --force"
    echo "  (paste token when prompted)"
    echo ""
    echo "Or with SSH:"
    echo "  git remote set-url origin git@github.com:nivoratech-commits/beacon.git"
    echo "  git push -u origin main --force"
fi
