# Test webhook with proper UTF-8 encoding for Hebrew text
# This script properly handles Hebrew characters

# Create the body object
$bodyObject = @{
    driveLink = "https://drive.google.com/file/d/12RWEwBnjrro7_0eqgIlmwfPs7-sEUAqc/view?usp=drive_link"
    title = "כוחו של השם הפרטי"
    caption = "כוחו של השם הפרטי איך שימוש בשם יוצר חיבור מיידי והשפעה רגשית."
}

# Convert to JSON with UTF-8 encoding
$body = ConvertTo-Json $bodyObject -Depth 10
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)

Write-Host "Request Body (UTF-8 encoded):" -ForegroundColor Green
Write-Host $body
Write-Host ""

# Send the request with UTF-8 body
$response = Invoke-WebRequest -Uri "https://auto.mytx.co/webhook/post-to-social" `
    -Method POST `
    -ContentType "application/json; charset=utf-8" `
    -Body $bodyBytes `
    -UseBasicParsing

Write-Host "Response Status:" -ForegroundColor Green
Write-Host $response.StatusCode
Write-Host ""

Write-Host "Response Content:" -ForegroundColor Green
Write-Host $response.Content
