from fastapi import FastAPI
from src.utils.db import engine, Base

# Import models here so Base knows about them before create_all()
from src.food.models import Food
from src.supplier.models import Supplier
from src.needy.models import Needy

# Import routers
from src.food.router import router as food_router
from src.supplier.router import router as supplier_router
from src.needy.router import router as needy_router

# Create the database tables
# NOTE: Ensure you have the PostGIS extension enabled in your DB: 
# Execute "CREATE EXTENSION IF NOT EXISTS postgis;" in your Postgres terminal first.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NeedNourish API",
    description="A platform connecting food donors with those in need.",
    version="1.0.0"
)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to NeedNourish API. Visit /docs for Swagger UI."}

# Include all module routers
app.include_router(food_router)
app.include_router(supplier_router)
app.include_router(needy_router)