from typing import List, Optional, Union
from app.models.user_model import Users, UsersRead

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select
from sqlalchemy import func
from sqlalchemy.orm import selectinload

from app.database import get_session
from app.models.community_info_model import *
from app.models.community_model import *
from app.models.member_model import *
from app.models.service_model import *
from app.models.country_model import *
from app.models.idp_model import *
from app.models.country_hashed_user_model import *

app = FastAPI(debug=True)

MembersReadWithCommunityInfo.update_forward_refs(
    Community_InfoRead=Community_InfoRead)
CommunityReadwithInfo.update_forward_refs(
    Community_InfoRead=Community_InfoRead)
Statistics_Country_HashedwithInfo.update_forward_refs(
    IdentityprovidersmapRead=IdentityprovidersmapRead, ServiceprovidersmapRead=ServiceprovidersmapRead, Country_CodesRead=Country_CodesRead)

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    count_interval: int = None,
    startDate: str = None,
    endDate: str = None,
):
    interval_subquery = ""
    if group_by:
        if interval and count_interval:
            interval_subquery = """WHERE created >
        date_trunc('{0}', CURRENT_DATE) - INTERVAL '{1} {2}'""".format(group_by, count_interval, interval)
        if startDate and endDate:
            interval_subquery = """
                WHERE created BETWEEN '{0}' AND '{1}'
            """.format(startDate, endDate)
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
    # statement = select(Community).options(selectinload(Community.community_info))
    # result = session.exec(statement)
    # community = result.one()
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
    offset: int = 0,
    # community_id: Union[None, int] = None
):
    # if not community_id:
    #     members = session.exec(select(Members).offset(offset)).all()
    # else:
    members = session.exec(select(Members).offset(offset)).all()
    return members


@app.get("/members_bystatus/")
def read_members_bystatus(
    *,
    session: Session = Depends(get_session),
    offset: int = 0,
    community_id: Union[None, int] = None
):
    if not community_id:
        members = session.exec(select(Members).offset(offset)).all()
    else:
        # members = session.exec(select(Members).offset(offset)).all()
        members = session.exec("""
             SELECT count(*) as count, community_id, status FROM members 
             WHERE community_id={0}
             GROUP BY community_id, status
          """.format(community_id)).all()
        # members = session.exec(""" SELECT community_id FROM members """)
    return members


@app.get("/services/", response_model=List[Serviceprovidersmap])
def read_services(
    *,
    session: Session = Depends(get_session),
    offset: int = 0
):

    services = session.exec(select(Serviceprovidersmap).offset(offset)).all()
    return services


@app.get("/idps/", response_model=List[Identityprovidersmap])
def read_services(
    *,
    session: Session = Depends(get_session),
    offset: int = 0
):

    idps = session.exec(select(Identityprovidersmap).offset(offset)).all()
    return idps


@app.get("/countries/", response_model=List[Country_CodesRead])
def read_countries(
    *,
    session: Session = Depends(get_session),
    offset: int = 0
):

    countries = session.exec(select(Country_Codes).offset(offset)).all()
    return countries


@app.get("/country_stats/", response_model=List[Statistics_Country_HashedwithInfo])
def read_country_stats(
    *,
    session: Session = Depends(get_session),
    offset: int = 0
):

    stats = session.exec(
        select(Statistics_Country_Hashed).offset(offset)).all()
    return stats


@app.get("/country_stats_by_vo/{community_id}")
def read_country_stats_by_vo(
    *,
    session: Session = Depends(get_session),
    offset: int = 0,
    community_id: Union[None, int] = None
):
    stats = []
    stats_country = session.exec("""
    WITH users_countries AS (
        SELECT statistics_country_hashed.hasheduserid as userid, status, country, countrycode, count(*) as sum_count
        FROM statistics_country_hashed
        JOIN members ON members.hasheduserid=statistics_country_hashed.hasheduserid
        JOIN country_codes ON countryid=country_codes.id
        WHERE community_id={0} AND country!='Unknown'
        GROUP BY userid, status, country, countrycode
    ),
    max_count_users_countries AS (
        SELECT DISTINCT userid, status, max(sum_count) as max_sum_count,row_number() OVER (ORDER BY userid, status) as row_number 
        FROM users_countries
        GROUP BY  userid, status
    )
    SELECT country,countrycode,count(*) as sum 
    FROM users_countries
    JOIN (
            SELECT userid, status, max_sum_count, max(row_number) 
            FROM max_count_users_countries GROUP BY userid, status, max_sum_count 
         ) max_count_users_countries_no_duplicates
    ON users_countries.userid=max_count_users_countries_no_duplicates.userid 
        AND users_countries.sum_count=max_count_users_countries_no_duplicates.max_sum_count
    GROUP BY country,countrycode
    ORDER BY country;
          """.format(community_id)).all()
    status_per_country = session.exec("""
    WITH users_countries AS (
        SELECT statistics_country_hashed.hasheduserid as userid, status, country, countrycode, count(*) as sum_count
        FROM statistics_country_hashed
        JOIN members ON members.hasheduserid=statistics_country_hashed.hasheduserid
        JOIN country_codes ON countryid=country_codes.id
        WHERE community_id={0} AND country!='Unknown'
        GROUP BY userid, status, country, countrycode
    ),
    max_count_users_countries AS (
        SELECT DISTINCT userid, status, max(sum_count) as max_sum_count, row_number() OVER (ORDER BY userid, status) as row_number 
        FROM users_countries
        GROUP BY  userid, status
    )
    SELECT country,countrycode, users_countries.status, count(*) as sum 
    FROM users_countries
    JOIN (
            SELECT userid, status, max_sum_count, max(row_number) 
            FROM max_count_users_countries GROUP BY userid, status, max_sum_count 
         ) max_count_users_countries_no_duplicates
    ON users_countries.userid=max_count_users_countries_no_duplicates.userid 
        AND users_countries.sum_count=max_count_users_countries_no_duplicates.max_sum_count
    GROUP BY country,countrycode, users_countries.status
    ORDER BY country;
        """.format(community_id)).all()
    stats.append(stats_country)
    stats.append(status_per_country)
    return stats


# Users Endpoints
#
@app.get("/users/", response_model=List[UsersRead])
def read_users(
    *,
    session: Session = Depends(get_session),
    offset: int = 0
):

    users = session.exec(select(Users).offset(offset)).all()
    return users


@app.get("/registered_users_country")
def read_users_country(
    *,
    session: Session = Depends(get_session),
    offset: int = 0,
    startDate: str = None,
    endDate: str = None,
):
    interval_subquery = ""
    if startDate and endDate:
        interval_subquery = """
                WHERE users.created BETWEEN '{0}' AND '{1}'
            """.format(startDate, endDate)
    users_countries = session.exec(
        """WITH users_countries AS (
        SELECT statistics_country_hashed.hasheduserid as userid, country, countrycode, count(*) as sum_count
        FROM statistics_country_hashed
        JOIN country_codes ON countryid=country_codes.id
        GROUP BY userid, country, countrycode
        ),
        max_count_users_countries AS (
            SELECT DISTINCT userid, max(sum_count) as max_sum_count,row_number() OVER (ORDER BY userid) as row_number 
            FROM users_countries
            GROUP BY  userid
        )
        SELECT country,countrycode, count(*) as sum 
                FROM users_countries
                JOIN (
                        SELECT userid, max_sum_count, max(row_number) 
                        FROM max_count_users_countries GROUP BY userid, max_sum_count 
                    ) max_count_users_countries_no_duplicates
                ON users_countries.userid=max_count_users_countries_no_duplicates.userid 
                    AND users_countries.sum_count=max_count_users_countries_no_duplicates.max_sum_count
                JOIN users ON users.hasheduserid=users_countries.userid AND status='A'
                {0}
                GROUP BY country,countrycode
                ORDER BY country,countrycode
        """.format(interval_subquery)).all()
    return users_countries


@app.get("/registered_users_country_group_by/{group_by}")
def read_users_country_groupby(
    *,
    session: Session = Depends(get_session),
    offset: int = 0,
    group_by: str,
    startDate: str = None,
    endDate: str = None,
):
    if group_by:
        interval_subquery = ""
        if startDate and endDate:
            interval_subquery = """
                WHERE users.created BETWEEN '{0}' AND '{1}'
            """.format(startDate, endDate)
        users = session.exec(
            """WITH users_countries AS (
        SELECT statistics_country_hashed.hasheduserid as userid, country, countrycode, count(*) as sum_count
        FROM statistics_country_hashed
        JOIN country_codes ON countryid=country_codes.id
        GROUP BY userid, country, countrycode
        ),
        max_count_users_countries AS (
            SELECT DISTINCT userid, max(sum_count) as max_sum_count,row_number() OVER (ORDER BY userid) as row_number 
            FROM users_countries
            GROUP BY  userid
        )
        SELECT range_date, min(created_min_date) as min_date, STRING_AGG(country, '|| ') as countries, sum(sum)  as count
        FROM 
            (
                SELECT date_trunc('{0}', users.created) as range_date, CONCAT(country,': ',count(*)) as country, min(users.created) as created_min_date,  count(*) as sum 
                FROM users_countries
                JOIN (
                        SELECT userid, max_sum_count, max(row_number) 
                        FROM max_count_users_countries GROUP BY userid, max_sum_count 
                    ) max_count_users_countries_no_duplicates
                ON users_countries.userid=max_count_users_countries_no_duplicates.userid 
                    AND users_countries.sum_count=max_count_users_countries_no_duplicates.max_sum_count
                JOIN users ON users.hasheduserid=users_countries.userid AND status='A'
                {1}
                GROUP BY range_date, country,countrycode
                ORDER BY range_date, country
            ) user_country_group_by
        GROUP BY range_date""".format(group_by, interval_subquery)).all()
        return users


@app.get("/registered_users_groupby/{group_by}")
def read_users_groupby(
    *,
    session: Session = Depends(get_session),
    offset: int = 0,
    group_by: str,
    interval: Union[str, None] = None,
    count_interval: int = None,
    startDate: str = None,
    endDate: str = None,
):

    interval_subquery = ""
    if group_by:
        if interval and count_interval:
            interval_subquery = """AND created >
        date_trunc('{0}', CURRENT_DATE) - INTERVAL '{1} {2}'""".format(group_by, count_interval, interval)
        if startDate and endDate:
            interval_subquery = """
                AND created BETWEEN '{0}' AND '{1}'
            """.format(startDate, endDate)
        users = session.exec("""
        select count(*) as count, date_trunc( '{0}', created ) as range_date, 
            min(created) as min_date
        from users
        WHERE status = 'A' 
        {1}
        group by range_date
        ORDER BY range_date ASC
        """.format(group_by, interval_subquery)).all()
    return users


@app.get("/registered_users_countby")
def read_users_countby(
    *,
    session: Session = Depends(get_session),
    offset: int = 0,
    interval: Union[str, None] = None,
    count_interval: int = None,
):

    interval_subquery = ""
    if interval and count_interval:
        interval_subquery = """AND created >
        CURRENT_DATE - INTERVAL '{0} {1}'""".format(count_interval, interval)

    users = session.exec("""
    select count(*) as count
    from users
    WHERE status = 'A' 
    {0}""".format(interval_subquery)).all()
    return users

# Dashboard Page


@app.get("/logins_countby")
def read_logins_countby(
    *,
    session: Session = Depends(get_session),
    offset: int = 0,
    interval: Union[str, None] = None,
    count_interval: int = None,
):
    interval_subquery = ""
    if interval and count_interval:
        interval_subquery = """WHERE date >
        CURRENT_DATE - INTERVAL '{0} {1}'""".format(count_interval, interval)

    logins = session.exec("""
    select sum(count) as count
    from statistics_country_hashed
    {0}""".format(interval_subquery)).all()
    return logins


@app.get("/logins_groupby/{group_by}")
def read_logins_groupby(
    *,
    session: Session = Depends(get_session),
    offset: int = 0,
    group_by: str,
    idp: str = None,
    sp: str = None
):
    interval_subquery = ""
    if idp != None:
        interval_subquery = """ 
            JOIN identityprovidersmap ON sourceidpid=identityprovidersmap.id
            WHERE entityid = '{0}'
        """.format(idp)
    elif sp != None:
         interval_subquery = """ 
            JOIN serviceprovidersmap ON serviceid=serviceprovidersmap.id
            WHERE identifier = '{0}'
        """.format(sp)

    logins = session.exec("""
            select sum(count) as count, date_trunc('{0}', date) as date
            from statistics_country_hashed
            {1}
            GROUP BY date_trunc('{0}', date)
            ORDER BY date_trunc('{0}', date) ASC
        """.format(group_by, interval_subquery)).all()
    return logins


@app.get("/logins_per_idp/")
def read_logins_per_idp(
    *,
    session: Session = Depends(get_session),
    offset: int = 0,
    idp: str = None,
    startDate: str = None,
    endDate: str = None,
):
    interval_subquery = ""
    if idp == None:
        if startDate and endDate:
            interval_subquery = """
                WHERE date BETWEEN '{0}' AND '{1}'
            """.format(startDate, endDate)
        logins = session.exec("""
                select name, entityid, sourceidpid, sum(count) as count
                from statistics_country_hashed
                join identityprovidersmap ON identityprovidersmap.id=sourceidpid
                {0}
                GROUP BY sourceidpid, name, entityid
                ORDER BY count DESC
            """.format(interval_subquery)).all()
        return logins


@app.get("/logins_per_sp/")
def read_logins_per_sp(
    *,
    session: Session = Depends(get_session),
    offset: int = 0,
    idp: str = None,
    startDate: str = None,
    endDate: str = None,
):
    interval_subquery = ""
    idp_subquery_join = ""
    if idp:
        idp_subquery_join = """
        JOIN identityprovidersmap ON identityprovidersmap.id=sourceidpid
        AND entityid = '{0}'
        """.format(idp)

    if startDate and endDate:
        interval_subquery = """
            WHERE date BETWEEN '{0}' AND '{1}'
        """.format(startDate, endDate)
    logins = session.exec("""
        select serviceprovidersmap.name, identifier, serviceid, sum(count) as count
        from statistics_country_hashed
        join serviceprovidersmap ON serviceprovidersmap.id=serviceid
        {0}
        {1}
        GROUP BY serviceid, serviceprovidersmap.name, identifier
        ORDER BY count DESC
    """.format(idp_subquery_join, interval_subquery)).all()
    return logins


@app.get("/logins_per_country/")
def read_logins_per_country(
    *,
    session: Session = Depends(get_session),
    offset: int = 0,
    group_by: Union[str, None] = None,
    startDate: str = None,
    endDate: str = None,
):
    interval_subquery = ""
    if group_by:
        if startDate and endDate:
            interval_subquery = """
                WHERE date BETWEEN '{0}' AND '{1}'
            """.format(startDate, endDate)

        logins = session.exec("""
        SELECT range_date, sum(count_country) as count, min(min_login_date) as min_date, STRING_AGG(country, '|| ') as countries 
        FROM (
            SELECT date_trunc('{0}', date) as range_date, min(date) as min_login_date, sum(count) as count_country, CONCAT(country,': ',sum(count)) as country
            from statistics_country_hashed
            JOIN country_codes ON countryid=country_codes.id
            {1}
            GROUP BY range_date, country
            ORDER BY range_date,country ASC
            ) country_logins
        GROUP BY range_date
        """.format(group_by, interval_subquery)).all()
    else:
        if startDate and endDate:
            interval_subquery = """
                WHERE date BETWEEN '{0}' AND '{1}'
            """.format(startDate, endDate)
        logins = session.exec(""" 
        SELECT country, countrycode,sum(count) as sum
            from statistics_country_hashed
            JOIN country_codes ON countryid=country_codes.id
            {0}
            GROUP BY country,countrycode
        """.format(interval_subquery)).all()
    return logins
