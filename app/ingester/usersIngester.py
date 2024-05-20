from app.logger import log
from app.utils import configParser
from .utilsIngester import utilsIngester
import hashlib

class UserDataIngester:
    logger = log.get_logger("UserDataIngester")

    @classmethod
    def ingestUserDataPerTenenv(cls, tenenv, session):
        tenenvId = tenenv['id']
        tenant_name = tenenv['tenant_name']
        environment_name = tenenv['environment_name']
        hashed_user_ids = []

        config_file = f'config.{tenant_name.lower()}.{environment_name.lower()}.py'

        if (configParser.getConfig('user_excludelist', config_file) is not False and
           'user_ids' in configParser.getConfig('user_excludelist', config_file)):
            user_ids = configParser.getConfig('user_excludelist', config_file)['user_ids'].split('\n')
            # Hash each value using SHA-256
            hashed_user_ids = [hashlib.md5(value.strip().encode()).hexdigest() for value in user_ids]

        # get dates not mapped for users data
        datesNotMapped = utilsIngester.getDatesNotMapped(
            "users",
            "updated",
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
        cls.logger.info("""between {0}""".format(between))
        usersNotMapped = session.exec("""
            SELECT jsondata FROM statistics_raw WHERE (type='registration' OR type='user_status') AND tenenv_id={0} {1}
        """.format(tenenvId, between)).all()
        userMappedItems = 0
        for user in usersNotMapped:
            cls.logger.info("""hasheduserid {0}""".format(user[0]))
            if (user[0]['type'] == 'registration' and 'status' not in user[0]):
                user[0]['status'] = 'A'
            if (user[0]['status'] not in ['A', 'S', 'D']):
                cls.logger.error("""
                    user status '{0}' is not valid """.format(user[0]['status']))
                continue
            if ('voPersonId' not in user[0]):
                cls.logger.warning("""voPersonId not found at record. Ignoring...""")
                continue
            if (user[0]['voPersonId'] in hashed_user_ids):
                cls.logger.info("""Ignore this user with
                    hash {0} as he is at the blacklist""". format(user[0]['voPersonId']))
                continue
            session.exec("""INSERT INTO users(hasheduserid, created, updated, status, tenenv_id)
                VALUES ('{0}','{1}','{1}', '{2}', {3})
                ON CONFLICT(hasheduserid, tenenv_id)
                DO UPDATE SET status='{2}', updated='{1}'""". format(
                user[0]['voPersonId'], user[0]['date'],  user[0]['status'],
                user[0]['tenenvId']))
            session.commit()
            userMappedItems += 1

        cls.logger.info("""
                {0} users ingested or updated""".format(userMappedItems))

    @classmethod
    def ingestUserData(cls, session):
        tenenvIds = session.exec("""SELECT tenenv_info.id,
                                  tenant_info.name AS tenant_name,
                                  environment_info.name AS environment_name
                                 FROM tenenv_info 
                                 JOIN tenant_info ON tenant_id=tenant_info.id
                                 JOIN environment_info ON env_id=environment_info.id
                                 """).all()
        # for each tenenv on database try to ingest UserData
        # from statistics_raw table
        for tenenv in tenenvIds:
            UserDataIngester.ingestUserDataPerTenenv(tenenv, session)