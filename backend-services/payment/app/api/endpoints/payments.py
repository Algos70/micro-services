"""Payment endpoints."""
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from schemas.payment_schema import PaymentCreate, PaymentResponse  # Define these schemas
from db.dependencies import get_db
from services.payment_service import (
    get_all_payments,
    get_user_payments,
    get_payment_by_id,
    create_payment,
    update_payment_status,
    delete_payment,
)

router = APIRouter(
    prefix="/payments",
    tags=["payments"]
)

@router.get("/", response_model=list[PaymentResponse])
def list_payments(db: Session = Depends(get_db)):
    """
    Retrieve all payments.
    """
    try:
        payments = get_all_payments(db)
        return payments
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching payments: {str(e)}"
        )

@router.get("/{payment_id}", response_model=PaymentResponse)
def get_payment(payment_id: str, db: Session = Depends(get_db)):
    """
    Retrieve a payment by its ID.
    """
    try:
        payment = get_payment_by_id(db, payment_id)
        return payment
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching the payment: {str(e)}"
        )

@router.get("/user/{email}", response_model=list[PaymentResponse])
def get_payments_by_user(email: str, db: Session = Depends(get_db)):
    """
    Retrieve all payments for the specified user.
    """
    try:
        payments = get_user_payments(db, email)
        return payments
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching user payments: {str(e)}"
        )

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=PaymentResponse)
def create_payment_endpoint(payment: PaymentCreate, db: Session = Depends(get_db)):
    """
    Create a new payment.
    """
    try:
        new_payment = create_payment(db, payment.model_dump())
        return JSONResponse(content={"id": new_payment.id}, status_code=status.HTTP_201_CREATED)

    except KeyError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the payment: {str(e)}"
        )

@router.put("/{payment_id}/status/{new_status}", response_model=PaymentResponse)
def update_payment_status_endpoint(payment_id: str, new_status: str, db: Session = Depends(get_db)):
    """
    Update the status of a payment.
    """
    try:
        payment = update_payment_status(db, payment_id, new_status)
        return payment
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while updating the payment status: {str(e)}"
        )

@router.delete("/{payment_id}", status_code=status.HTTP_200_OK)
def delete_payment_endpoint(payment_id: str, db: Session = Depends(get_db)):
    """
    Delete a payment by its ID.
    """
    try:
        delete_payment(db, payment_id)
        return JSONResponse(content={"message": "Payment deleted successfully"}, status_code=status.HTTP_200_OK)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting the payment: {str(e)}"
        )