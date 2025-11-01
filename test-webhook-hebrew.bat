@echo off
REM Alternative: Use curl with proper UTF-8 handling (if installed)
REM This is more reliable than PowerShell for UTF-8

curl -X POST https://auto.mytx.co/webhook-test/post-to-social ^
  -H "Content-Type: application/json; charset=utf-8" ^
  -d "{\"driveLink\":\"https://drive.google.com/file/d/12RWEwBnjrro7_0eqgIlmwfPs7-sEUAqc/view?usp=drive_link\",\"title\":\"כוחו של השם הפרטי\",\"caption\":\"כוחו של השם הפרטי איך שימוש בשם יוצר חיבור מיידי והשפעה רגשית.\"}"

pause
