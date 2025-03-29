from fastapi import APIRouter, HTTPException
from services.saga_orchestrator import SagaOrchestrator
from models.order import OrderCreateRequest, OrderResponse

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=OrderResponse)
def create_order(order_req: OrderCreateRequest):
    orchestrator = SagaOrchestrator()
    result = orchestrator.start_order_saga(order_req)
    
    if not result.success:
        raise HTTPException(status_code=400, detail=result.message)
    return result.data
