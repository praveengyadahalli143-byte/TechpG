$supabaseUrl = "https://prqiqakdghwzbzmkoccp.supabase.co"
$supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBycWlxYWtkZ2h3emJ6bWtvY2NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NTA4NDcsImV4cCI6MjA4NzIyNjg0N30.UUEIcCNqB1ZrEUHBtGLPnKA8QIt76L7KV7yfRV4OhPg"

# Write to temp files without trailing newline
[System.IO.File]::WriteAllText("$env:TEMP\sb_url.txt", $supabaseUrl)
[System.IO.File]::WriteAllText("$env:TEMP\sb_key.txt", $supabaseKey)

Write-Host "Adding NEXT_PUBLIC_SUPABASE_URL..."
cmd /c "type $env:TEMP\sb_url.txt | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production 2>&1"
cmd /c "type $env:TEMP\sb_url.txt | npx vercel env add NEXT_PUBLIC_SUPABASE_URL preview 2>&1"
cmd /c "type $env:TEMP\sb_url.txt | npx vercel env add NEXT_PUBLIC_SUPABASE_URL development 2>&1"

Write-Host "Adding NEXT_PUBLIC_SUPABASE_ANON_KEY..."
cmd /c "type $env:TEMP\sb_key.txt | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production 2>&1"
cmd /c "type $env:TEMP\sb_key.txt | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview 2>&1"
cmd /c "type $env:TEMP\sb_key.txt | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development 2>&1"

Remove-Item "$env:TEMP\sb_url.txt" -Force
Remove-Item "$env:TEMP\sb_key.txt" -Force
Write-Host "Done!"
