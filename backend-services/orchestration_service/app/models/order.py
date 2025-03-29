from pydantic import BaseModel, EmailStr
from typing import List, Optional

class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int
    unit_price: float
    
class OrderCreateRequest(BaseModel):
    user_email: EmailStr
    vendor_email: EmailStr
    delivery_address: str
    description: Optional[str] = None
    status: Optional[str] = "Pending"
    items: List[OrderItemCreate]

class OrderResponse(BaseModel):
    id: str
    user_email: EmailStr
    vendor_email: EmailStr
    delivery_address: str
    description: Optional[str]
    status: str
    items: List[OrderItemCreate]
    total_amount: float
    created_at: str