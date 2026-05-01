from fastapi import APIRouter, HTTPException
from app.models.schemas import ProcessInboxRequest, ProcessInboxResponse
from app.agents.communication_agent import process_inbox
from app.data.simulated_data import SIMULATED_INBOX

router = APIRouter(prefix="/inbox", tags=["inbox"])


@router.post("/process", response_model=ProcessInboxResponse)
async def process_inbox_route(request: ProcessInboxRequest):
    try:
        messages = SIMULATED_INBOX if request.use_simulated else []
        if request.messages:
            messages = [m.model_dump() for m in request.messages]
        result = process_inbox(messages)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/messages")
async def get_simulated_messages():
    return {"messages": SIMULATED_INBOX, "count": len(SIMULATED_INBOX)}
