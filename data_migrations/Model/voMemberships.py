from Model.pgConnector import destinationPgConnector
from Utils import configParser
from Logger import log
import hashlib
class voMemberships(object):
  logger = log.get_logger("voMemberships")
  VOMEMBERSHIPSTABLE = configParser.getConfig('destination_tables')['vo_memberships']

  def __init__(self, vo_id, userid, status):
    self.community_id = vo_id
    self.hasheduserid = userid
    self.status = status

#   @classmethod
#   def getLastDate(self):
#     pgConn = destinationPgConnector()
#     result = pgConn.execute_select("SELECT max(created::date) FROM {0}".format(voMemberships.VOMEMBERSHIPSTABLE))
#     return result


  @classmethod
  def truncate(self):
    pgConn = destinationPgConnector()
    # remove all data
    pgConn.execute_and_commit(
        """
        TRUNCATE TABLE {0}
        """.format(voMemberships.VOMEMBERSHIPSTABLE)
    )
  
  @classmethod
  def saveAll(self, voMembershipsList):
    pgConn = destinationPgConnector()
    values = ''
    for item in voMembershipsList:
      values += """INSERT INTO {0}(community_id, hasheduserid, status) 
      VALUES ('{1}', '{2}','{3}') 
      ON CONFLICT(community_id,hasheduserid) DO UPDATE SET status='{3}';
      """.format(voMemberships.VOMEMBERSHIPSTABLE, item.community_id, item.hasheduserid, item.status)
    pgConn.execute_and_commit(values)

  @classmethod
  def getMembershipStatus(self, voId, hasheduserid):
    pgConn = destinationPgConnector()
    result = pgConn.execute_select("""
     SELECT status FROM {0} WHERE community_id={1} AND hasheduserid='{2}'"""
     .format(voMemberships.VOMEMBERSHIPSTABLE, voId, hasheduserid))
    return result