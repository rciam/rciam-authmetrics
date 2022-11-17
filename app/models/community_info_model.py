from typing import List, Optional,TYPE_CHECKING
from sqlmodel import Field, Relationship, Session, SQLModel
from sqlalchemy import UniqueConstraint
from datetime import date, datetime

if TYPE_CHECKING:
    from .community_model import Community
    from .member_model import Members

# Communities
class CommunityInfoBase(SQLModel):
    name: str
    description: str
    source: str
    #created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    #modified_at: Optional[datetime] = None

class Community_Info(CommunityInfoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    communities: List["Community"] = Relationship(back_populates="community_info")
    members: List["Members"] = Relationship(back_populates="community_info")

class Community_InfoRead(CommunityInfoBase):
    id: int

