from typing import List, Optional,TYPE_CHECKING
from sqlmodel import Field, Relationship, Session, SQLModel
from sqlalchemy import UniqueConstraint
from datetime import date, datetime

if TYPE_CHECKING:
    from .country_hashed_user_model import Statistics_Country_Hashed
    from .member_model import Members

# Communities
class Country_CodesBase(SQLModel):
    countrycode: str
    country: str


class Country_Codes(Country_CodesBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    countries: List["Statistics_Country_Hashed"] = Relationship(back_populates="country_info")

class Country_CodesRead(Country_CodesBase):
    id: int

