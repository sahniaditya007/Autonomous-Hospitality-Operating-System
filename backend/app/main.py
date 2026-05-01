from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import inbox, simulation, properties, intelligence

app = FastAPI(
    title="STRIX — Autonomous Hospitality Operating System",
    description="AI-powered ops intelligence for short-term rentals",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(inbox.router)
app.include_router(simulation.router)
app.include_router(properties.router)
app.include_router(intelligence.router)


@app.get("/")
async def root():
    return {
        "system": "STRIX — Autonomous Hospitality Operating System",
        "version": "1.0.0",
        "status": "operational",
        "modules": [
            "autonomous_inbox",
            "decision_engine",
            "digital_twin_simulation",
            "property_health_score",
            "ops_memory_graph",
            "stay_debrief",
            "maintenance_predictor",
            "ai_auditor",
            "listing_optimizer",
            "demand_spiker",
            "complaint_miner",
        ]
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
