"""Order bisuness logic."""
from sqlalchemy.orm import Session, joinedload
from models.order import Order
from models.order_item import OrderItem

def get_all_orders(db: Session) -> list:
    """
    Retrieve all orders.
    """
    return db.query(Order).options(joinedload(Order.items)).all()

def get_user_orders(db: Session, email: str) -> list:
    """
    Retrieve all orders for the specified user.
    """
    return db.query(Order).filter(Order.email == email).options(joinedload(Order.items)).all()

def get_order_by_id(db: Session, order_id: str) -> Order:
    """
    Retrieve an order by its ID.
    """
    return db.query(Order).filter(Order.id == order_id).options(joinedload(Order.items)).first()
def create_order(db: Session, order_data: dict) -> Order:
    """
    Create a new order with the provided order data.
    """
    items_data = order_data.pop("items", [])
    
    total_price = sum(item["quantity"] * item["unit_price"] for item in items_data)
    
    new_order = Order(
        email=order_data["email"],
        vendor_email=order_data["vendor_email"],
        delivery_address=order_data["delivery_address"],
        description=order_data.get("description"),
        delivery_date=order_data.get("delivery_date"),
        status=order_data.get("status", "Pending"),
        total_price=total_price,  
    )
    
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    for item_data in items_data:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item_data["product_id"],
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"],
        )
        db.add(order_item)
    db.commit()
    
    return new_order