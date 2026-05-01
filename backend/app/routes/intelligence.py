from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    MemoryGraphResponse, StayDebrief, MaintenancePrediction,
    DemandSpike, ComplaintPattern
)
from app.core.memory_graph import get_graph_data
from app.agents.debrief_agent import get_all_debriefs, get_debrief
from app.agents.maintenance_predictor import get_maintenance_predictions
from app.agents.demand_engine import get_demand_spikes
from app.agents.complaint_miner import mine_complaints

router = APIRouter(prefix="/intelligence", tags=["intelligence"])


@router.get("/memory-graph", response_model=MemoryGraphResponse)
async def get_memory_graph():
    try:
        return get_graph_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/debriefs", response_model=list[StayDebrief])
async def get_debriefs():
    try:
        return get_all_debriefs()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/debriefs/{booking_id}", response_model=StayDebrief)
async def get_single_debrief(booking_id: str):
    try:
        return get_debrief(booking_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/maintenance", response_model=list[MaintenancePrediction])
async def get_maintenance():
    try:
        return get_maintenance_predictions()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/demand-spikes", response_model=list[DemandSpike])
async def get_demand():
    try:
        return get_demand_spikes()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/complaint-patterns", response_model=list[ComplaintPattern])
async def get_complaint_patterns():
    try:
        return mine_complaints()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
