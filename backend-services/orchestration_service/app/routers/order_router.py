from fastapi import APIRouter, Depends, HTTPException, Request
from routers import PAYMENT_METHODS
from services.saga_orchestrator import SagaOrchestrator, get_saga_orchestrator
from models.order import OrderCreateRequest, OrderResponse

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=OrderResponse)
def create_order(order_req: OrderCreateRequest):
    orchestrator = SagaOrchestrator()
    result = orchestrator.start_order_saga(order_req)
    
    if not result.success:
        raise HTTPException(status_code=400, detail=result.message)
    return result.data

@router.post("/create_order", response_model=OrderResponse)
def create_order(
    order_req: OrderCreateRequest,
    request: Request,
    orchestrator: SagaOrchestrator = Depends(get_saga_orchestrator),

):  
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    payment_method = order_req.payment_method
    if payment_method not in PAYMENT_METHODS:
        raise HTTPException(status_code=400, detail="Invalid payment method")

    order_id = orchestrator.start_order_saga(order_req, token=auth_header)  
    return {"message": "Order creation started"}