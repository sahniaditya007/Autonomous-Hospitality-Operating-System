from fastapi import APIRouter, HTTPException
from app.models.schemas import PropertyHealthScore, AuditorPersona, AuditorFeedback, ListingOptimization
from app.agents.health_score import get_all_health_scores, get_health_score
from app.agents.auditor_agent import run_audit, run_full_audit
from app.agents.listing_optimizer import optimize_listing, optimize_all_listings
from app.data.simulated_data import PROPERTIES

router = APIRouter(prefix="/properties", tags=["properties"])


@router.get("/")
async def list_properties():
    return {"properties": PROPERTIES}


@router.get("/health", response_model=list[PropertyHealthScore])
async def get_health_scores():
    try:
        return get_all_health_scores()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{property_id}/health", response_model=PropertyHealthScore)
async def get_property_health(property_id: str):
    try:
        return get_health_score(property_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{property_id}/audit", response_model=AuditorFeedback)
async def audit_property(property_id: str, persona: AuditorPersona = AuditorPersona.BUSINESS_TRAVELER):
    try:
        return run_audit(property_id, persona)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{property_id}/audit/full", response_model=list[AuditorFeedback])
async def full_audit_property(property_id: str):
    try:
        return run_full_audit(property_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{property_id}/listing", response_model=ListingOptimization)
async def optimize_property_listing(property_id: str):
    try:
        return optimize_listing(property_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/listings/optimize-all", response_model=list[ListingOptimization])
async def optimize_all():
    try:
        return optimize_all_listings()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
