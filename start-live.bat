@echo off
title Aura Cosmetology - Live Server

echo ============================================
echo  Aura Cosmetology - Live Server with ngrok
echo ============================================
echo.

:: Проверка наличия ngrok
where ngrok >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ОШИБКА] ngrok не найден. Установите его:
    echo   winget install --id Ngrok.Ngrok --exact
    echo   или скачайте с https://ngrok.com/download
    pause
    exit /b 1
)

:: Проверка наличия node_modules
if not exist "node_modules" (
    echo [INFO] Устанавливаю зависимости...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ОШИБКА] npm install не удался
        pause
        exit /b 1
    )
)

:: Проверка наличия данных
if not exist "src\data\services.json" (
    echo [INFO] Генерирую данные...
    call npm run generate
)

echo [INFO] Запускаю Vite dev-сервер (порт 5173)...
start "Vite Dev Server" cmd /c "npm run dev"

:: Небольшая пауза, чтобы Vite успел стартовать
timeout /t 4 /nobreak >nul

echo [INFO] Запускаю ngrok-туннель к localhost:5173...
echo.
echo [ВАЖНО] В окне ngrok найдите строку:
echo   Forwarding  https://xxxx-xx-xx-xx-xx.ngrok-free.app -^> http://localhost:5173
echo.
echo Откройте этот URL на телефоне, чтобы увидеть сайт.
echo.
start "ngrok Tunnel" cmd /k "ngrok http http://localhost:5173"

echo.
echo ============================================
echo  Готово! Dev-сервер и туннель запущены.
echo  Закройте окна терминалов для остановки.
echo ============================================
echo.
pause
