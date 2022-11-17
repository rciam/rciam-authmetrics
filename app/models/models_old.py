from typing import List, Optional
from sqlmodel import Field, Relationship, Session, SQLModel
from sqlalchemy import UniqueConstraint
from datetime import date, datetime


# User
class UserBase(SQLModel):
    first_name: str
    last_name: str
    email: str = Field(index=True)
    password: str


class User(UserBase, table=True):
    __table_args__ = (UniqueConstraint("email"),)
    id: Optional[int] = Field(default=None, primary_key=True)


class UserCreate(UserBase):
    pass


class UserRead(UserBase):
    id: int


class UserUpdate(SQLModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None


class UserLogin(SQLModel):
    email: str
    password: str


class UserLoginResponse(SQLModel):
    id: int
    email: str
    first_name: str
    last_name: str


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

class Community_InfoRead(CommunityInfoBase):
    id: int

class CommunityBase(SQLModel):
    created: date = Field(nullable=False)
    community_id: int = Field(primary_key=True, foreign_key="community_info.id")
    

class Community(CommunityBase, table=True):
    #community_id: Optional[int] = Field(default=None, primary_key=True)
    #id: Optional[int] = Field(default=None, primary_key=True)
    community_info: Community_Info = Relationship(sa_relationship_kwargs={'uselist': False},back_populates="communities")

class CommunityRead(CommunityBase):
    pass
    
class CommunityReadwithInfo(CommunityRead):
    community_info:  Community_InfoRead

# class Community_InfoReadwithCommunity(Community_InfoRead):
#     pass
#     #communities:  Optional[Community] = None

# Songs
class SongBase(SQLModel):
    title: str
    artist: str
    release_date: str

    user_id: Optional[int] = Field(default=None, foreign_key="user.id")

# class CommunityCreate(CommunityBase):
#     pass


# class CommunitiesUpdate(SQLModel):
#     name: Optional[str] = None
#     description: Optional[str] = None
#     modified_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)