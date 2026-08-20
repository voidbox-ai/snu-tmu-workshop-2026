@echo off
setlocal
cd /d "%~dp0"
echo.
echo  Presence Before Synchronization
echo.
where python >/dev/null 2>&1
if %errorlevel%==0 ( python serve.py & goto :eof )
where py >/dev/null 2>&1
if %errorlevel%==0 ( py serve.py & goto :eof )
echo  Python not found.
echo.
echo  Install Python from https://python.org, or open index.html directly.
echo  Without Python the slides still work, but the S speaker view and
echo  note editing will not. Use N for notes and T for the timer instead.
echo.
pause
