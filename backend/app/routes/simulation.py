from fastapi import APIRouter, HTTPException
from app.models.schemas import SimulationRequest, SimulationResult, SimulationScenario
from app.agents.simulation_engine import run_simulation

router = APIRouter(prefix="/simulation", tags=["simulation"])


@router.post("/run", response_model=SimulationResult)
async def run_simulation_route(request: SimulationRequest):
    try:
        return run_simulation(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/scenarios")
async def list_scenarios():
    return {
        "scenarios": [
            {"id": s.value, "name": s.value.replace("_", " ").title()}
            for s in SimulationScenario
        ]
    }
