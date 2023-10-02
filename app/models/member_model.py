from typing import List, Optional,TYPE_CHECKING
from sqlmodel import Field, Relationship, Session, SQLModel
from sqlalchemy import UniqueConstraint
from datetime import date, datetime

if TYPE_CHECKING:
    from .community_model import Community_Info,Community_InfoRead

class MemberBase(SQLModel):
    community_id: int = Field(primary_key=True, foreign_key="community_info.id")
    hasheduserid: str = Field(primary_key=True)
    status: str

class Members(MemberBase, table=True):
    community_info: "Community_Info" = Relationship(sa_relationship_kwargs={'uselist': False},back_populates="members")

class MembersRead(MemberBase):
    pass

class MembersReadWithCommunityInfo(MembersRead):
    community_info:  "Community_InfoRead"




    