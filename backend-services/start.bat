@echo off
echo Building and starting Docker containers...
docker compose up --build -d

IF %ERRORLEVEL% NEQ 0 (
    echo Failed to start Docker containers.
    exit /b %ERRORLEVEL%
) ELSE (
    echo Docker containers started successfully.
)
pause