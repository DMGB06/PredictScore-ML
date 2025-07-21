"""
PredictScore-ML Backend - API Principal
====================================== 

API FastAPI para predicción de rendimiento académico
usando modelos ML optimizados aplicando principios SOLID.

Autor: Equipo Grupo 4
Fecha: 2025
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn
import logging
import time
import traceback

# Configurar logging básico
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuración fallback
class Settings:
    app_name = "PredictScore-ML API"
    debug = True
    host = "127.0.0.1"
    port = 8001

settings = Settings()

# Imports locales con manejo de errores
try:
    from services.ml_service import ml_service
    ML_SERVICE_AVAILABLE = True
    logger.info("✅ Servicio ML importado correctamente")
except ImportError as e:
    logger.warning(f"⚠️ No se pudo importar ml_service: {e}")
    ML_SERVICE_AVAILABLE = False
    Settings = type('Settings', (), {
        'APP_NAME': 'PredictScore-ML API',
        'APP_VERSION': '2.0.0',
        'HOST': '127.0.0.1',
        'PORT': 8000,
        'DEBUG': True,
        'ALLOWED_ORIGINS': ['http://localhost:3000', 'http://127.0.0.1:3000']
    })()
    ml_service = None

# Instancia global del servicio ML
ml_service_instance = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manejo del ciclo de vida de la aplicación."""
    global ml_service_instance
    
    # Startup
    logger.info("🚀 Iniciando PredictScore-ML API...")
    
    try:
        # Inicializar servicio ML si está disponible
        if ml_service:
            ml_service_instance = ml_service
            await ml_service_instance.initialize()
            app.state.ml_service = ml_service_instance
            logger.info("✅ ML Service inicializado")
        else:
            logger.warning("⚠️  ML Service no disponible, usando modo fallback")
            
        logger.info("✅ API inicializada correctamente")
        
    except Exception as e:
        logger.error(f"❌ Error inicializando API: {e}")
        # No hacer raise para permitir que la API inicie en modo degradado
        
    yield
    
    # Shutdown
    logger.info("🔄 Cerrando PredictScore-ML API...")
    if ml_service_instance:
        try:
            await ml_service_instance.cleanup()
        except:
            pass

# Crear aplicación FastAPI
app = FastAPI(
    title=Settings.APP_NAME,
    description="API para predicción de rendimiento académico usando ML",
    version=Settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=Settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Middleware de logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Middleware para logging de requests."""
    start_time = time.time()
    
    # Ejecutar request
    response = await call_next(request)
    
    # Log del request
    process_time = time.time() - start_time
    logger.info(f"{request.method} {request.url.path} - {response.status_code} - {process_time:.3f}s")
    
    return response

# Manejadores de errores globales
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Manejador global de excepciones."""
    logger.error(f"Error no manejado: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "Ocurrió un error interno del servidor"
        }
    )

@app.get("/")
async def root():
    """Endpoint raíz."""
    return {
        "message": "PredictScore-ML API v2.0",
        "description": "API para predicción de rendimiento académico",
        "version": "2.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    print("🚀 Iniciando PredictScore-ML API...")
    print(f"📍 URL: http://{Settings.HOST}:{Settings.PORT}")
    print(f"📚 Docs: http://{Settings.HOST}:{Settings.PORT}/docs")
    
    try:
        import uvicorn
        uvicorn.run(
            "main:app",
            host=Settings.HOST,
            port=Settings.PORT,
            reload=Settings.DEBUG,
            log_level="info"
        )
    except ImportError:
        logger.error("uvicorn no está instalado. Instalar con: pip install uvicorn")
    except Exception as e:
        logger.error(f"Error iniciando servidor: {e}")
