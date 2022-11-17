from typing import List, Optional, Union

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select
from sqlalchemy import func
from sqlalchemy.orm import selectinload

from app.database import get_session
from app.models.community_info_model import *
from app.models.community_model import *
from app.models.member_model import *

app = FastAPI(debug=True)

MembersReadWithCommunityInfo.update_forward_refs(Community_InfoRead=Community_InfoRead)
CommunityReadwithInfo.update_forward_refs(Community_InfoRead=Community_InfoRead)

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/ping")
def pong():
    return {"ping": "pong!"}

@app.get("/communities/", response_model=List[CommunityReadwithInfo])
def read_communities(
        *, 
        session: Session = Depends(get_session),
        offset: int = 0
    ):
    
    communities = session.exec(select(Community).offset(offset)).all()
    return communities

@app.get("/communities_groupby/{group_by}")
def read_communities(
        *, 
        session: Session = Depends(get_session),
        offset: int = 0, 
        group_by: str,
        interval: Union[str, None] = None,
        count_interval: int = None
    ):
    interval_subquery=""
    if group_by:
        if interval and count_interval:
            interval_subquery = """WHERE created >
        date_trunc('month', CURRENT_DATE) - INTERVAL '{0} {1}'""".format(count_interval, interval)

        communities = session.exec("""
        select count(*) as count, date_trunc( '{0}', created ) as range_date, 
            min(created) as min_date , string_agg(name,'|| ') as names, 
            string_agg(to_char(created, 'YYYY-MM-DD'),', ') as created_date, 
            string_agg(description,'|| ') as description
        from community
        join community_info on community.community_id=community_info.id
        {1}
        group by range_date
        ORDER BY range_date ASC
        """.format(group_by, interval_subquery)).all()
    return communities

@app.get("/communities/{community_id}", response_model=CommunityReadwithInfo)
def read_community(*, session: Session = Depends(get_session), community_id: int):
    community = session.get(Community, community_id)
    #statement = select(Community).options(selectinload(Community.community_info))
    #result = session.exec(statement)
    #community = result.one()
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    return community

@app.get("/communities_info/", response_model=List[Community_InfoRead])
def read_communities_info(
        *,
        session: Session = Depends(get_session),
        offset: int = 0
    ):
    communities = session.exec(select(Community_Info).offset(offset)).all()
    return communities

@app.get("/members/", response_model=List[MembersReadWithCommunityInfo])
def read_members(
        *,
        session: Session = Depends(get_session),
        offset: int = 0
    ):
    members = session.exec(select(Members).offset(offset)).all()
    return members

