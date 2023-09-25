from typing import List, Optional,TYPE_CHECKING
from sqlmodel import Field, Relationship, Session, SQLModel
from sqlalchemy import UniqueConstraint
from datetime import date, datetime

if TYPE_CHECKING:
    from .idp_model import *
    from .service_model import *
    from .country_model import *


class Statistics_Country_HashedBase(SQLModel):
    date: date
    hasheduserid: str 
    sourceidpid: int = Field(foreign_key="identityprovidersmap.id")
    serviceid : int = Field(foreign_key="serviceprovidersmap.id")
    countryid: int = Field(foreign_key="country_codes.id")
    count: int
    

class Statistics_Country_Hashed(Statistics_Country_HashedBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    identityprovider_info: "Identityprovidersmap" = Relationship(sa_relationship_kwargs={'uselist': False},back_populates="idps")
    serviceprovider_info: "Serviceprovidersmap" = Relationship(sa_relationship_kwargs={'uselist': False},back_populates="services")
    country_info: "Country_Codes" = Relationship(sa_relationship_kwargs={'uselist': False},back_populates="countries")

class Statistics_Country_HashedRead(Statistics_Country_HashedBase):
    pass
    
class Statistics_Country_HashedwithInfo(Statistics_Country_HashedRead):
    identityprovider_info: Optional["IdentityprovidersmapRead"]
    serviceprovider_info: Optional["ServiceprovidersmapRead"]
    country_info: Optional["Country_CodesRead"]
