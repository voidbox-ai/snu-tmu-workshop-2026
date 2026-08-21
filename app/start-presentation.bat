@echo off
REM Presence Before Synchronization — start the deck.
REM Installs dependencies the first time, then runs the dev server, which is
REM what the speaker view's note editor and the image drop-in page need.

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Node.js is not installed.
  echo   Get the LTS build from https://nodejs.org and run this again.
  echo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo.
  echo   First run — installing dependencies. This takes a minute.
  echo.
  call npm install
  if errorlevel 1 (
    echo   npm install failed.
    pause
    exit /b 1
  )
)

echo.
echo   http://localhost:8000/
echo.
echo   S = speaker view (notes are editable there and save back to disk)
echo   images: http://localhost:8000/images.html
echo   stop the server: Ctrl+C
echo.

call npm run dev
pause
