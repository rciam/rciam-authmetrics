from typing import List, Optional,TYPE_CHECKING
from sqlmodel import Field, Relationship, Session, SQLModel
from sqlalchemy import UniqueConstraint
from datetime import date, datetime

if TYPE_CHECKING:
    from .country_hashed_user_model import Statistics_Country_Hashed

# Communities
class ServiceprovidersmapBase(SQLModel):
    identifier: str
    name: str

class Serviceprovidersmap(ServiceprovidersmapBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    services: List["Statistics_Country_Hashed"] = Relationship(back_populates="serviceprovider_info")

class ServiceprovidersmapRead(ServiceprovidersmapBase):
    id: int

