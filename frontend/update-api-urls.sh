#!/bin/bash
# Script to Update API URLs in Frontend Components
# Run this from the frontend directory

echo "🔄 Updating API URLs in frontend components..."

files=(
    "src/Components/UserList.jsx"
    "src/Components/ChatBox.jsx"
    "src/Components/GroupList.jsx"
    "src/Components/GroupChatBox.jsx"
    "src/Components/Calendar.jsx"
    "src/Feed.jsx"
    "src/Profile.jsx"
    "src/Login.jsx"
    "src/Signup.jsx"
    "src/Dashboard.jsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "📝 Processing $file..."
        
        # Add import if not exists
        if ! grep -q "import API_URL" "$file"; then
            # Add import after the last import statement
            sed -i '/^import/a import API_URL from '"'"'../config/api'"'"';' "$file"
        fi
        
        # Replace localhost URLs
        sed -i 's|"http://localhost:5001|`${API_URL}|g' "$file"
        sed -i "s|'http://localhost:5001|\`\${API_URL}|g" "$file"
        
        echo "✅ Updated $file"
    else
        echo "⚠️  File not found: $file"
    fi
done

echo ""
echo "✨ All files updated! Don't forget to:"
echo "1. Create .env.production with VITE_API_URL=your-backend-url"
echo "2. Test locally with 'npm run dev'"
echo "3. Commit and push changes"
