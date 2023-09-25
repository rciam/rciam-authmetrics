from typing import List, Optional,TYPE_CHECKING
from sqlmodel import Field, Relationship, Session, SQLModel
from sqlalchemy import UniqueConstraint
from datetime import date, datetime

if TYPE_CHECKING:
    from .community_info_model import Community_Info, Community_InfoRead


class CommunityBase(SQLModel):
    created: date = Field(nullable=False)
    community_id: int = Field(primary_key=True, foreign_key="community_info.id")
    

class Community(CommunityBase, table=True):
    #community_id: Optional[int] = Field(default=None, primary_key=True)
    #id: Optional[int] = Field(default=None, primary_key=True)
    community_info: "Community_Info" = Relationship(sa_relationship_kwargs={'uselist': False},back_populates="communities")

class CommunityRead(CommunityBase):
    pass
    
class CommunityReadwithInfo(CommunityRead):
    community_info:  Optional["Community_InfoRead"]
