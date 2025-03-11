"""Payment bisuness logic."""
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from models.payment import Payment

def get_all_payment(db: Session) -> list[Payment]:
    """
    Retrieve all payments from the database.

    Args:
        db (Session): Database session.

    Returns:
        List[Payment]: A list of all payments.

    Raises:
        SQLAlchemyError: If there is a database error.
    """
    try:
        payments = db.query(Payment).options(joinedload(Payment.items)).all()
        return payments
    
    except SQLAlchemyError as e:
        raise SQLAlchemyError(f"Database error while retrieving payments: {str(e)}")
    
    except Exception as e:
        raise Exception(f"An unexpected error occurred: {str(e)}")


def get_user_payments(db: Session, email: str) -> list[Payment]:
    """
    Retrieve all payments for the specified user.

    Args:
        db (Session): Database session.
        email (str): The email of the user whose payments are to be retrieved.

    Returns:
        List[Payment]: A list of payments for the specified user.

    Raises:
        SQLAlchemyError: If there is a database error.
        ValueError: If the email is invalid or no payments are found.
    """
    if not email or not isinstance(email, str):
        raise ValueError("Invalid email address.")
    
    try:
        payments = db.query(Payment).filter(Payment.user_email == email).options(joinedload(Payment.items)).all()
        
        if not payments:
            raise ValueError(f"No payments found for user with email: {email}")
        
        return payments
    
    except SQLAlchemyError as e:
        raise SQLAlchemyError(f"Database error while retrieving payments for user {email}: {str(e)}")
    
    except Exception as e:
        raise Exception(f"An unexpected error occurred: {str(e)}")

def get_payment_by_id(db: Session, payment_id: str) -> Payment:
    """
    Retrieve an payment by its ID.

    Args:
        db (Session): Database session.
        payment_id (str): The ID of the payment to retrieve.

    Returns:
        Payment: The payment with the specified ID.

    Raises:
        SQLAlchemyError: If there is a database error.
        ValueError: If the payment ID is invalid or no payment is found.
    """
    if not payment_id or not isinstance(payment_id, str):
        raise ValueError("Invalid payment ID.")
    
    try:
        payment = db.query(Payment).filter(Payment.id == payment_id).options(joinedload(Payment.items)).first()
        
        if not payment:
            raise ValueError(f"No payment found with ID: {payment_id}")
        
        return payment
    
    except SQLAlchemyError as e:
        raise SQLAlchemyError(f"Database error while retrieving payment with ID {payment_id}: {str(e)}")
    
    except Exception as e:
        raise Exception(f"An unexpected error occurred: {str(e)}")

def create_payment(db: Session, payment_data: dict) -> Payment:
    """
    Create a new payment with the provided payment data.
    
    Args:
        db (Session): Database session.
        payment_data (Dict): Dictionary containing payment details.
        
    Returns:
        Payment: The newly created payment.
        
    Raises:
        ValueError: If the input data is invalid.
        KeyError: If required keys are missing.
        SQLAlchemyError: If there is a database error.
    """
    try:
        
        required_fields = ["user_email", "order_id", "amount", "payment_method"]
        if not all(field in payment_data for field in required_fields):
            raise KeyError(f"Payment data must contain the following fields: {required_fields}")
        
        new_payment = Payment(
            user_email=payment_data["user_email"],
            order_id=payment_data["order_id"],
            amount=payment_data["amount"],
            payment_method=payment_data["payment_method"],
            transaction_id=payment_data.get("transaction_id"),
            payment_status=payment_data.get("payment_status"),
        )
        
        db.add(new_payment)
        db.commit()
        db.refresh(new_payment)
        
        return new_payment
    
    except KeyError as e:
        db.rollback()
        raise KeyError(f"Missing required field: {str(e)}")
    
    except ValueError as e:
        db.rollback()
        raise ValueError(f"Invalid data: {str(e)}")
    
    except IntegrityError as e:
        db.rollback()
        raise ValueError(f"Database integrity error: {str(e)}")
    
    except SQLAlchemyError as e:
        db.rollback()
        raise SQLAlchemyError(f"Database error: {str(e)}")
    
    except Exception as e:
        db.rollback()
        raise Exception(f"An unexpected error occurred: {str(e)}")
    
def update_payment_status(db: Session, payment_id: str, new_status: str) -> Payment:
    """
    Update the status of an payment.

    Args:
        db (Session): Database session.
        payment_id (str): The ID of the payment to update.
        new_status (str): The new status to set for the payment.

    Returns:
        Payment: The updated payment.

    Raises:
        ValueError: If the payment ID is invalid, the payment is not found, or the new status is invalid.
        SQLAlchemyError: If there is a database error.
    """
    if not payment_id or not isinstance(payment_id, str):
        raise ValueError("Invalid payment ID.")
    
    if not new_status or not isinstance(new_status, str):
        raise ValueError("Invalid status.")
    
    try:
        payment = db.query(Payment).filter(Payment.id == payment_id).first()
        
        if not payment:
            raise ValueError(f"No payment found with ID: {payment_id}")
        
        payment_id.status = new_status
        db.commit()
        db.refresh(payment)
        
        return payment
    
    except SQLAlchemyError as e:
        db.rollback() 
        raise SQLAlchemyError(f"Database error while updating payment status: {str(e)}")
    
    except Exception as e:
        db.rollback()  
        raise Exception(f"An unexpected error occurred: {str(e)}")

def delete_payment(db: Session, payment_id: str) -> None:
    """
    Delete an payment by its ID.

    Args:
        db (Session): Database session.
        payment_id (str): The ID of the payment to delete.

    Returns:
        None

    Raises:
        ValueError: If the payment ID is invalid or the payment is not found.
        SQLAlchemyError: If there is a database error.
    """
    if not payment_id or not isinstance(payment_id, str):
        raise ValueError("Invalid payment ID.")
    
    try:
        payment = db.query(Payment).filter(Payment.id == payment_id).first()
        if not payment:
            raise ValueError(f"No payment found with ID: {payment_id}")
        
        db.query(Payment).filter(Payment.id == payment_id).delete()
        db.commit()
    
    except SQLAlchemyError as e:
        db.rollback()  
        raise SQLAlchemyError(f"Database error while deleting payment: {str(e)}")
    
    except Exception as e:
        db.rollback()  
        raise Exception(f"An unexpected error occurred: {str(e)}")