"""Orders endpoints."""
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from schemas.order_schema import OrderCreate, OrderResponse
from db.dependencies import get_db
from models import ALLOWED_STATUSES
from services.order_service import (
    create_order, 
    get_all_orders, 
    get_user_orders, 
    get_order_by_id,
    delete_order,
    update_order_status,
    update_order_payment,
    update_order_delivery_date,
)

router = APIRouter(
    prefix="/orders",
    tags=["orders"]
)

@router.get("/", response_model=list[OrderResponse])
def list_orders(db: Session = Depends(get_db)):
    """
    Retrieve all orders.
    """
    try:
        orders = get_all_orders(db)
        return orders
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching orders: {str(e)}"
        )

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: str, db: Session = Depends(get_db)):
    """
    Retrieve an order by its ID.
    """
    try:
        order = get_order_by_id(db, order_id)
        return order
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching the order: {str(e)}"
        )

@router.get("/user/{email}", response_model=list[OrderResponse])
def get_orders_by_user(email: str, db: Session = Depends(get_db)):
    """
    Retrieve all orders for the specified user.
    """
    try:
        orders = get_user_orders(db, email)
        return orders
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching user orders: {str(e)}"
        )

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_order_endpoint(order: OrderCreate, db: Session = Depends(get_db)):
    """
    Create a new order.
    """
    try:
        new_order = create_order(db, order.model_dump())
        return JSONResponse(content={"id": new_order.id}, status_code=status.HTTP_201_CREATED)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the order: {str(e)}"
        )

@router.put("/{order_id}/status/{new_status}", response_model=OrderResponse)
def update_status(order_id: str, new_status: str, db: Session = Depends(get_db)):
    """
    Update the status of an order.
    """
    if new_status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Allowed statuses: {ALLOWED_STATUSES}"
        )
    try:
        order = update_order_status(db, order_id, new_status)
        return order
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while updating the order status: {str(e)}"
        )

@router.put("/{order_id}/payment/{payment_id}", response_model=OrderResponse)
def update_payment(order_id: str, payment_id: str, db: Session = Depends(get_db)):
    """
    Update the payment ID for an order.
    """
    try:
        order = update_order_payment(db, order_id, payment_id)
        return order
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while updating the payment ID: {str(e)}"
        )

@router.put("/{order_id}/delivery", response_model=OrderResponse)
def update_delivery_date(order_id: str, db: Session = Depends(get_db)):
    """
    Update the delivery date for an order.
    """
    try:
        order = update_order_delivery_date(db, order_id)
        return order
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while updating the delivery date: {str(e)}"
        )

@router.delete("/{order_id}", status_code=status.HTTP_200_OK)
def delete_order_endpoint(order_id: str, db: Session = Depends(get_db)):
    """
    Delete an order by its ID.
    """
    try:
        delete_order(db, order_id)
        return JSONResponse(content={"message": "Order deleted successfully"}, status_code=status.HTTP_200_OK)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting the order: {str(e)}"
        )