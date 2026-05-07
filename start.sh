#!/bin/bash
# Kill any existing server
kill $(lsof -ti:3000) 2>/dev/null

# Clear and rebuild
rm -rf .next
npx next build

# Start production server (more stable than dev server)
npx next start
