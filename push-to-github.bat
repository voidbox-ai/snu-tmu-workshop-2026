@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"

set REPO=snu-tmu-workshop-2026

echo.
echo   Publishing to GitHub: %REPO% (public)
echo.

where git >nul 2>&1
if errorlevel 1 (
  echo   git is not installed. Install it from https://git-scm.com and run this again.
  echo.
  pause
  exit /b 1
)

rem An earlier setup attempt could not finish because of sandbox permissions.
rem Clear whatever it left so the history starts clean.
if exist ".git"       rmdir /s /q ".git"
if exist "_to_delete"  rmdir /s /q "_to_delete"

git init -b main >nul 2>&1
git config user.name "Hyeogjin Noh"
git config user.email "hyeogjin.noh@voidbox.ai"
git add -A
if errorlevel 1 goto failed

git commit -q -m "Presence Before Synchronization - talk deck for the SNU x TMU workshop" -m "Self-contained reveal.js deck with speaker notes, a pacing clock, a local server that saves note edits back into index.html, and an image drop-in page. reveal.js and Pretendard are vendored so it runs with no network at the venue."
if errorlevel 1 goto failed

echo   Committed. Files in this first commit:
git show --stat --oneline HEAD | find /c /v ""
echo.

where gh >nul 2>&1
if errorlevel 1 goto manual

gh auth status >nul 2>&1
if errorlevel 1 (
  echo   GitHub CLI is installed but not signed in. Running: gh auth login
  echo.
  gh auth login
  if errorlevel 1 goto manual
)

gh repo create %REPO% --public --source=. --remote=origin --push
if errorlevel 1 goto manual

echo.
echo   Done. Opening the repository...
gh repo view --web
echo.
echo   To publish the slides as a web page:
echo     Settings ^> Pages ^> Deploy from a branch ^> main / (root) ^> Save
echo.
pause
exit /b 0

:manual
echo.
echo   The commit is ready locally. To finish, either install GitHub CLI
echo   (https://cli.github.com) and run this file again, or do it by hand:
echo.
echo     1. Create an EMPTY repository named %REPO% at https://github.com/new
echo        (no README, no .gitignore, no licence - this folder already has them)
echo.
echo     2. Then run these two lines here, with YOUR-ACCOUNT replaced:
echo.
echo        git remote add origin https://github.com/YOUR-ACCOUNT/%REPO%.git
echo        git push -u origin main
echo.
pause
exit /b 0

:failed
echo.
echo   Something went wrong above. Nothing was pushed.
echo.
pause
exit /b 1
