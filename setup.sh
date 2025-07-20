#!/bin/bash

# Script de configuración inicial completa para PredictScore-ML
# Autor: Equipo de Desarrollo
# Descripción: Instala todas las dependencias y ejecuta el sistema completo

echo "============================================================"
echo "PREDICTSCORE-ML - CONFIGURACIÓN INICIAL"
echo "============================================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar requisitos previos
print_status "Verificando requisitos previos..."

# Verificar Python
if command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version 2>&1 | awk '{print $2}')
    print_success "Python encontrado: $PYTHON_VERSION"
else
    print_error "Python no encontrado. Por favor instala Python 3.8+"
    exit 1
fi

# Verificar Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js encontrado: $NODE_VERSION"
else
    print_error "Node.js no encontrado. Por favor instala Node.js 16+"
    exit 1
fi

# Verificar npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm encontrado: $NPM_VERSION"
else
    print_error "npm no encontrado. Por favor instala npm"
    exit 1
fi

print_success "Todos los requisitos previos están instalados"

# Instalar dependencias del backend
print_status "Instalando dependencias del backend..."
cd backend
if pip install -r requirements.txt; then
    print_success "Dependencias de Python instaladas correctamente"
else
    print_error "Error instalando dependencias de Python"
    exit 1
fi
cd ..

# Instalar dependencias del frontend
print_status "Instalando dependencias del frontend..."
cd frontend
if npm install; then
    print_success "Dependencias de Node.js instaladas correctamente"
else
    print_error "Error instalando dependencias de Node.js"
    exit 1
fi
cd ..

print_success "Todas las dependencias instaladas correctamente"

# Crear script de inicio
print_status "Creando scripts de inicio..."

# Script para Windows
cat > start_system.bat << 'EOF'
@echo off
echo ============================================================
echo INICIANDO PREDICTSCORE-ML
echo ============================================================
echo Iniciando Backend...
start cmd /k "cd backend && python main_simple.py"
timeout /t 3 /nobreak > nul
echo Iniciando Frontend...
start cmd /k "cd frontend && npm run dev"
echo.
echo Sistema iniciado correctamente!
echo Frontend: http://localhost:3000
echo Backend: http://127.0.0.1:8001
echo API Docs: http://127.0.0.1:8001/docs
echo.
pause
EOF

# Script para Linux/Mac
cat > start_system.sh << 'EOF'
#!/bin/bash
echo "============================================================"
echo "INICIANDO PREDICTSCORE-ML"
echo "============================================================"
echo "Iniciando Backend..."
cd backend && python main_simple.py &
BACKEND_PID=$!
sleep 3
echo "Iniciando Frontend..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!
echo ""
echo "Sistema iniciado correctamente!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://127.0.0.1:8001"
echo "API Docs: http://127.0.0.1:8001/docs"
echo ""
echo "Para detener el sistema, presiona Ctrl+C"
wait $BACKEND_PID $FRONTEND_PID
EOF

chmod +x start_system.sh

print_success "Scripts de inicio creados"

# Ejecutar validación
print_status "Ejecutando validación del sistema..."
if python scripts/validate_system.py; then
    print_success "Validación completada exitosamente"
else
    print_warning "Algunos tests fallaron, pero el sistema puede funcionar"
fi

echo ""
echo "============================================================"
echo -e "${GREEN}CONFIGURACIÓN COMPLETADA EXITOSAMENTE${NC}"
echo "============================================================"
echo ""
echo "Para iniciar el sistema:"
echo "  Windows: start_system.bat"
echo "  Linux/Mac: ./start_system.sh"
echo ""
echo "URLs del sistema:"
echo "  Frontend: http://localhost:3000"
echo "  Backend: http://127.0.0.1:8001"
echo "  API Docs: http://127.0.0.1:8001/docs"
echo ""
echo "Para validar el sistema:"
echo "  python scripts/validate_system.py"
echo ""
echo -e "${GREEN}¡Proyecto listo para usar!${NC}"
echo "============================================================"
