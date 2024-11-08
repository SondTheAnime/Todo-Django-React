from ninja import Schema
from datetime import datetime
from typing import Optional


class TaskIn(Schema):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: str
    status: str
    category_id: Optional[int] = None


class TaskOut(Schema):
    id: int
    title: str
    description: Optional[str]
    due_date: Optional[datetime]
    priority: str
    status: str
    created_at: datetime
    updated_at: datetime
    category_id: Optional[int]
