from typing import List, Optional
from sqlmodel import Field, Relationship, Session, SQLModel
from sqlalchemy import UniqueConstraint
from datetime import datetime


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
class CommunityBase(SQLModel):
    name: str
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    modified_at: Optional[datetime] = None


class Community(CommunityBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


class CommunityRead(CommunityBase):
    id: int


class UserCommunitysRead(CommunityBase):
    id: int


class CommunityCreate(CommunityBase):
    pass


class CommunitiesUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    modified_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)