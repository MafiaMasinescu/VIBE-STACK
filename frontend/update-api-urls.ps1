# Script to Update API URLs in Frontend Components
# Run this from the frontend directory

Write-Host "🔄 Updating API URLs in frontend components..." -ForegroundColor Green

$apiConfig = "import API_URL from '../config/api';"
$files = @(
    "src/Components/UserList.jsx",
    "src/Components/ChatBox.jsx",
    "src/Components/GroupList.jsx",
    "src/Components/GroupChatBox.jsx",
    "src/Components/Calendar.jsx",
    "src/Feed.jsx",
    "src/Profile.jsx",
    "src/Login.jsx",
    "src/Signup.jsx",
    "src/Dashboard.jsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "📝 Processing $file..." -ForegroundColor Yellow
        
        $content = Get-Content $file -Raw
        
        # Check if import already exists
        if ($content -notmatch "import API_URL") {
            # Add import after other imports
            $content = $content -replace '(import.*from.*[";][\r\n]+)', "`$1$apiConfig`n"
        }
        
        # Replace localhost URLs with template literal
        $content = $content -replace '"http://localhost:5001', '`${API_URL}'
        $content = $content -replace "'http://localhost:5001", '`${API_URL}'
        
        Set-Content -Path $file -Value $content
        Write-Host "✅ Updated $file" -ForegroundColor Green
    } else {
        Write-Host "⚠️  File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`n✨ All files updated! Don't forget to:" -ForegroundColor Cyan
Write-Host "1. Create .env.production with VITE_API_URL=your-backend-url" -ForegroundColor White
Write-Host "2. Test locally with 'npm run dev'" -ForegroundColor White
Write-Host "3. Commit and push changes" -ForegroundColor White
