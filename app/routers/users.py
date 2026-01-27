from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Field, Session, SQLModel, create_engine, select
from typing import Union

from app.database import db
from app.utils.globalMethods import AuthNZCheck


# from ..dependencies import get_token_header

router = APIRouter(
    tags=["users"],
    dependencies=[Depends(AuthNZCheck("registered_users"))],
    # responses={404: {"description": "Not found"}},
)

@router.get("/min_date_registered_users")
async def read_min_date_registered_users(
        *,
        session: Session = Depends(db.get_session),
        tenenv_id: int
):
    min_date = session.exec("""
      SELECT min(created) as min_date 
                            FROM users
    """).one()
    return min_date

@router.get("/registered_users_country")
async def read_users_country(
        *,
        session: Session = Depends(db.get_session),
        offset: int = 0,
        startDate: str = None,
        endDate: str = None,
        tenenv_id: int,
        status: str = None
):
    # Build date filter (just the condition, not the WHERE keyword)
    date_filter = ""
    if startDate and endDate:
        date_filter = "AND u.created BETWEEN DATE('{0}') AND DATE('{1}')".format(
            startDate, endDate)

    # Build status filter
    status_filter = ""
    if status:
        status_filter = "AND u.status = '{0}'".format(status)
    else:
        status_filter = ""

    users_countries = session.exec(
        """WITH user_country_logins AS (
        SELECT
            sch.hasheduserid,
            sch.countryid,
            SUM(sch.count) AS login_count,
            MIN(sch.date) AS first_login_date
        FROM statistics_country_hashed sch
        WHERE sch.tenenv_id = {1}
        GROUP BY sch.hasheduserid, sch.countryid
    ),
    primary_country_per_user AS (
        SELECT
            ucl.hasheduserid,
            ucl.countryid,
            ROW_NUMBER() OVER (
                PARTITION BY ucl.hasheduserid
                ORDER BY
                    ucl.login_count DESC,
                    ucl.first_login_date ASC
            ) AS rn
        FROM user_country_logins ucl
    )
        SELECT country, countrycode, count(*) as sum
        FROM primary_country_per_user pcu
        JOIN country_codes cc ON cc.id = pcu.countryid
        JOIN users u ON u.hasheduserid = pcu.hasheduserid
        WHERE pcu.rn = 1
        AND u.tenenv_id = {1}
        {0}
        {2}
        GROUP BY country, countrycode
        ORDER BY country, countrycode
        """.format(date_filter, tenenv_id, status_filter)).all()
    return users_countries


@router.get("/registered_users_country_group_by")
async def read_users_country_groupby_no_groupby(
        *,
        session: Session = Depends(db.get_session),
        offset: int = 0,
        startDate: str = None,
        endDate: str = None,
        tenenv_id: int,
        status: str = None
):
    # When group_by is not provided, return single row summary
    # Build date filter (just the condition, not the WHERE keyword)
    date_filter = ""
    if startDate and endDate:
        date_filter = "AND u.created BETWEEN DATE('{0}') AND DATE('{1}')".format(
            startDate, endDate)

    # Build status filter
    status_filter = ""
    if status:
        status_filter = "AND status = '{0}'".format(status)
    else:
        status_filter = ""

    # Build total users filter (for counting users without country)
    total_users_filter = ""
    if startDate and endDate:
        total_users_filter = "AND created BETWEEN DATE('{0}') AND DATE('{1}')".format(
            startDate, endDate)
    if status:
        total_users_filter += " AND status = '{0}'".format(status)

    users_countries = session.exec(
        """WITH user_country_logins AS (
        SELECT
            sch.hasheduserid,
            sch.countryid,
            SUM(sch.count) AS login_count,
            MIN(sch.date) AS first_login_date
        FROM statistics_country_hashed sch
        WHERE sch.tenenv_id = {1}
        GROUP BY sch.hasheduserid, sch.countryid
    ),
    primary_country_per_user AS (
        SELECT
            ucl.hasheduserid,
            ucl.countryid,
            ROW_NUMBER() OVER (
                PARTITION BY ucl.hasheduserid
                ORDER BY
                    ucl.login_count DESC,
                    ucl.first_login_date ASC
            ) AS rn
        FROM user_country_logins ucl
    ),
    known_countries AS (
        SELECT
            cc.country,
            CONCAT(cc.country, ': ', count(*)) as country_count,
            count(*) as country_total
        FROM primary_country_per_user pcu
        JOIN country_codes cc ON cc.id = pcu.countryid
        JOIN users u ON u.hasheduserid = pcu.hasheduserid
        WHERE pcu.rn = 1
        AND u.tenenv_id = {1}
        {0}
        {2}
        GROUP BY cc.country
    ),
    total_users AS (
        SELECT count(*) as total
        FROM users
        WHERE tenenv_id = {1}
        {5}
    ),
    known_users_count AS (
        SELECT COALESCE(SUM(country_total), 0) as known_total
        FROM known_countries
    ),
    unknown_countries AS (
        SELECT
            'Unknown' as country,
            CONCAT('Unknown: ', (SELECT total FROM total_users) - (SELECT known_total FROM known_users_count)) as country_count,
            (SELECT total FROM total_users) - (SELECT known_total FROM known_users_count) as country_total
        WHERE (SELECT total FROM total_users) > (SELECT known_total FROM known_users_count)
    )
        SELECT
            CONCAT('{3}', ' TO ', '{4}') as range_date,
            sum(country_total) as count,
            STRING_AGG(country_count, ' || ') as countries
        FROM (
            SELECT * FROM known_countries
            UNION ALL
            SELECT * FROM unknown_countries
        ) all_countries
        """.format(date_filter, tenenv_id, status_filter,
                   startDate if startDate else 'N/A', endDate if endDate else 'N/A',
                   total_users_filter)).all()
    return users_countries


@router.get("/registered_users_country_group_by/{group_by}")
async def read_users_country_groupby(
        *,
        session: Session = Depends(db.get_session),
        offset: int = 0,
        group_by: str,
        startDate: str = None,
        endDate: str = None,
        tenenv_id: int,
        status: str = None
):
    # Build date filter (just the condition, not the WHERE keyword)
    date_filter = ""
    if startDate and endDate:
        date_filter = "AND u.created BETWEEN DATE('{0}') AND DATE('{1}')".format(
            startDate, endDate)

    # Build status filter
    status_filter = ""
    if status:
        status_filter = "AND u.status = '{0}'".format(status)
    else:
        status_filter = ""

    # Build total users filter (for counting users without country)
    total_users_filter = ""
    if startDate and endDate:
        total_users_filter = "AND created BETWEEN DATE('{0}') AND DATE('{1}')".format(
            startDate, endDate)
    if status:
        total_users_filter += " AND status = '{0}'".format(status)

    users = session.exec(
        """WITH user_country_logins AS (
        SELECT
            sch.hasheduserid,
            sch.countryid,
            SUM(sch.count) AS login_count,
            MIN(sch.date) AS first_login_date
        FROM statistics_country_hashed sch
        WHERE sch.tenenv_id = {1}
        GROUP BY sch.hasheduserid, sch.countryid
    ),
    primary_country_per_user AS (
        SELECT
            ucl.hasheduserid,
            ucl.countryid,
            ROW_NUMBER() OVER (
                PARTITION BY ucl.hasheduserid
                ORDER BY
                    ucl.login_count DESC,
                    ucl.first_login_date ASC
            ) AS rn
        FROM user_country_logins ucl
    ),
    known_countries AS (
        SELECT date_trunc('{0}', u.created) as range_date,
               cc.country as country_name,
               CONCAT(cc.country, ': ', count(*)) as country,
               min(u.created) as created_min_date,
               count(*) as sum
        FROM primary_country_per_user pcu
        JOIN country_codes cc ON cc.id = pcu.countryid
        JOIN users u ON u.hasheduserid = pcu.hasheduserid
        WHERE pcu.rn = 1
        AND u.tenenv_id = {1}
        {2}
        {3}
        GROUP BY range_date, cc.country, cc.countrycode
    ),
    total_users_per_range AS (
        SELECT date_trunc('{0}', created) as range_date,
               count(*) as total
        FROM users
        WHERE tenenv_id = {1}
        {4}
        GROUP BY range_date
    ),
    known_users_per_range AS (
        SELECT range_date,
               COALESCE(SUM(sum), 0) as known_total
        FROM known_countries
        GROUP BY range_date
    ),
    unknown_per_range AS (
        SELECT tup.range_date,
               'Unknown' as country_name,
               CONCAT('Unknown: ', tup.total - COALESCE(kup.known_total, 0)) as country,
               tup.range_date as created_min_date,
               tup.total - COALESCE(kup.known_total, 0) as sum
        FROM total_users_per_range tup
        LEFT JOIN known_users_per_range kup ON tup.range_date = kup.range_date
        WHERE tup.total > COALESCE(kup.known_total, 0)
    )
    SELECT range_date, min(created_min_date) as min_date, STRING_AGG(country, '|| ') as countries, sum(sum) as count
    FROM
        (
            SELECT * FROM known_countries
            UNION ALL
            SELECT * FROM unknown_per_range
        ) user_country_group_by
    GROUP BY range_date
    ORDER BY range_date ASC
    """.format(group_by, tenenv_id, date_filter, status_filter, total_users_filter)).all()
    return users


@router.get("/registered_users_groupby/{group_by}")
async def read_users_groupby(
        *,
        session: Session = Depends(db.get_session),
        offset: int = 0,
        group_by: str,
        interval: Union[str, None] = None,
        count_interval: int = None,
        startDate: str = None,
        endDate: str = None,
        tenenv_id: int,
        status: str = None
):
    # Build status filter
    status_filter = ""
    if status:
        status_filter = "AND status = '{0}'".format(status)
    else:
        status_filter = ""

    interval_subquery = ""
    if group_by:
        if interval and count_interval:
            interval_subquery = """AND created >
        date_trunc('{0}', CURRENT_DATE) - INTERVAL '{1} {2}'""".format(group_by, count_interval, interval)
        if startDate and endDate:
            interval_subquery = """
                AND created BETWEEN DATE('{0}') AND DATE('{1}')
            """.format(startDate, endDate)
        users = session.exec("""
        select count(*) as count, date_trunc( '{0}', created ) as range_date,
            min(created) as min_date
        from users
        WHERE tenenv_id = {1}
        {3}
        {2}
        group by range_date
        ORDER BY range_date ASC
        """.format(group_by, tenenv_id, interval_subquery, status_filter)).all()
    return users


@router.get("/registered_users_countby")
async def read_users_countby(
        *,
        session: Session = Depends(db.get_session),
        offset: int = 0,
        interval: Union[str, None] = None,
        count_interval: int = None,
        tenenv_id: int,
        status: str = None
):
    # Build status filter
    status_filter = ""
    if status:
        status_filter = "AND status = '{0}'".format(status)
    else:
        status_filter = ""

    interval_subquery = ""
    if interval and count_interval:
        interval_subquery = """AND created >
        CURRENT_DATE - INTERVAL '{0} {1}'""".format(count_interval, interval)

    users = session.exec("""
    select count(*) as count
    from users
    WHERE tenenv_id = {1}
    {2}
    {0}""".format(interval_subquery, tenenv_id, status_filter)).all()
    return users
