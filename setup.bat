@echo off
:: Script de configuración inicial completa para PredictScore-ML
:: Autor: Equipo de Desarrollo
:: Descripción: Instala todas las dependencias y ejecuta el sistema completo

echo ============================================================
echo PREDICTSCORE-ML - CONFIGURACION INICIAL
echo ============================================================

:: Verificar requisitos previos
echo [INFO] Verificando requisitos previos...

:: Verificar Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python no encontrado. Por favor instala Python 3.8+
    pause
    exit /b 1
) else (
    for /f "tokens=2" %%i in ('python --version 2^>^&1') do echo [SUCCESS] Python encontrado: %%i
)

:: Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no encontrado. Por favor instala Node.js 16+
    pause
    exit /b 1
) else (
    for /f %%i in ('node --version') do echo [SUCCESS] Node.js encontrado: %%i
)

:: Verificar npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm no encontrado. Por favor instala npm
    pause
    exit /b 1
) else (
    for /f %%i in ('npm --version') do echo [SUCCESS] npm encontrado: %%i
)

echo [SUCCESS] Todos los requisitos previos están instalados

:: Instalar dependencias del backend
echo [INFO] Instalando dependencias del backend...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Error instalando dependencias de Python
    pause
    exit /b 1
) else (
    echo [SUCCESS] Dependencias de Python instaladas correctamente
)
cd ..

:: Instalar dependencias del frontend
echo [INFO] Instalando dependencias del frontend...
cd frontend
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Error instalando dependencias de Node.js
    pause
    exit /b 1
) else (
    echo [SUCCESS] Dependencias de Node.js instaladas correctamente
)
cd ..

echo [SUCCESS] Todas las dependencias instaladas correctamente

:: Crear script de inicio
echo [INFO] Creando scripts de inicio...

echo @echo off > start_system.bat
echo echo ============================================================ >> start_system.bat
echo echo INICIANDO PREDICTSCORE-ML >> start_system.bat
echo echo ============================================================ >> start_system.bat
echo echo Iniciando Backend... >> start_system.bat
echo start cmd /k "cd backend && python main_simple.py" >> start_system.bat
echo timeout /t 3 /nobreak ^> nul >> start_system.bat
echo echo Iniciando Frontend... >> start_system.bat
echo start cmd /k "cd frontend && npm run dev" >> start_system.bat
echo echo. >> start_system.bat
echo echo Sistema iniciado correctamente! >> start_system.bat
echo echo Frontend: http://localhost:3000 >> start_system.bat
echo echo Backend: http://127.0.0.1:8001 >> start_system.bat
echo echo API Docs: http://127.0.0.1:8001/docs >> start_system.bat
echo echo. >> start_system.bat
echo pause >> start_system.bat

echo [SUCCESS] Scripts de inicio creados

:: Ejecutar validación
echo [INFO] Ejecutando validación del sistema...
python scripts/validate_system.py
if %errorlevel% neq 0 (
    echo [WARNING] Algunos tests fallaron, pero el sistema puede funcionar
) else (
    echo [SUCCESS] Validación completada exitosamente
)

echo.
echo ============================================================
echo CONFIGURACION COMPLETADA EXITOSAMENTE
echo ============================================================
echo.
echo Para iniciar el sistema:
echo   start_system.bat
echo.
echo URLs del sistema:
echo   Frontend: http://localhost:3000
echo   Backend: http://127.0.0.1:8001
echo   API Docs: http://127.0.0.1:8001/docs
echo.
echo Para validar el sistema:
echo   python scripts/validate_system.py
echo.
echo ¡Proyecto listo para usar!
echo ============================================================
pause
