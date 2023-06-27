from app.logger import log
from ..database import get_session
from sqlalchemy.exc import NoResultFound
from .utilsIngester import utilsIngester


class CommunityDataIngester:
    logger = log.get_logger("CommunityDataIngester")

    @classmethod
    def getCommunityId(cls, communityName, tenenvId, session):
        # Check if community exists
        try:
            communityId = session.exec(
              """
              SELECT id FROM community_info
              WHERE name = '{0}' AND tenenv_id={1}
              """.format(
                  communityName, tenenvId
              )
            ).one()
        except NoResultFound:
            cls.logger.error("""Community with name {0}
                               not found for
                               tenenvId {1}""".format(communityName,
                                                      tenenvId))
            communityId = None
        return communityId

    @classmethod
    def ingestCommunityDataPerTenenv(cls, tenenvId, session):
        # get dates not mapped for communities data
        datesNotMapped = utilsIngester.getDatesNotMapped(
            "community",
            "created",
            tenenvId,
            session)
        between = ""
        if datesNotMapped[0] is not None:
            between = " AND (date BETWEEN '{0}' AND '{1}')".format(
                datesNotMapped[0], datesNotMapped[1])
        elif datesNotMapped[1] is not None:
            between = " AND date <= '{0}'".format(
                datesNotMapped[1]
            )
        communitiesNotMapped = session.exec("""
            SELECT jsondata FROM statistics_raw WHERE (type='vo')
            AND tenenv_id={0} {1}
        """.format(tenenvId, between)).all()
        communityMappedItems = 0
        for community in communitiesNotMapped:
            communityId = session.exec("""INSERT INTO community_info(
                name, description, source, tenenv_id)
                VALUES ('{0}','{1}','{2}', {3})
                ON CONFLICT(name, tenenv_id)
                DO NOTHING
                RETURNING id;""". format(
                community['name'], community['description'], community['source'],
                tenenvId))
            if (communityId is not None):
                session.exec("""INSERT INTO community(community_id, created,
                tenenv_id)
                VALUES({0},'{1}',{2})""".format(communityId,
                                                community['date'], tenenvId))
            communityMappedItems += 1
        cls.logger.info("""{0} communities ingested or updated""".
                        format(communityMappedItems))

    @classmethod
    def ingestCommunityData(cls):
        session_generator = get_session()
        session = next(session_generator)
        tenenvIds = session.exec("""SELECT id FROM tenenv_info""").all()
        # for each tenenv on database try to ingest CommunityData
        # from statistics_raw table
        for tenenvId in tenenvIds:
            CommunityDataIngester.ingestCommunityDataPerTenenv(
                tenenvId[0], session)