from typing import List, Optional,TYPE_CHECKING
from sqlmodel import Field, Relationship, Session, SQLModel
from sqlalchemy import UniqueConstraint
from datetime import date, datetime


class UserBase(SQLModel):
    
    hasheduserid: str = Field(primary_key=True)
    created: date
    status: str

class Users(UserBase, table=True):
    pass

class UsersRead(UserBase):
    pass





    