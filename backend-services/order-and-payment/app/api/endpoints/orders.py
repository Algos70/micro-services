"""Orders endpoints."""
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.params import Depends
from sqlalchemy.orm import Session
from schemas.order_schema import OrderCreate
from db.dependencies import get_db
from services.order_service import (
    create_order, 
    get_all_orders, 
    get_user_orders, 
    get_order_by_id
    )

router = APIRouter(
    prefix="/orders",
    tags=["orders"]
)

@router.get("/")
def fetch_all_orders(db: Session = Depends(get_db)):
    """
    Retrieve all orders.
    """
    orders = get_all_orders(db)
    return orders

@router.get("/{email}")
def fetch_user_orders(email: str, db: Session = Depends(get_db)):
    """
    Retrieve all orders for the specified user.
    """
    orders = get_user_orders(db, email)
    return orders

@router.get("/{order_id}")
def fetch_order_by_id(order_id: str, db: Session = Depends(get_db)):
    """
    Retrieve an order by its ID.
    """
    order = get_order_by_id(db, order_id)
    return order

@router.post("/", status_code=201)
def create_new_order(order: OrderCreate, db: Session = Depends(get_db)):
    """
    Create a new order without returning the order details.
    """
    create_order(db, order.model_dump())
    return JSONResponse(content={"message": "Order created successfully"}, status_code=201)