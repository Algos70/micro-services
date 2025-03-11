"""Order schema."""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int = 1
    unit_price: float

class OrderCreate(BaseModel):
    email: EmailStr
    vendor_email: EmailStr
    delivery_address: str
    description: Optional[str] = None
    delivery_date: Optional[datetime] = None
    status: Optional[str] = "Pending"
    items: List[OrderItemCreate] 