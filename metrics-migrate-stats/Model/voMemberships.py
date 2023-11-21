from Model.pgConnector import destinationPgConnector
from Utils import configParser
from Logger import log
import hashlib
class voMemberships(object):
  logger = log.get_logger("voMemberships")
  VOMEMBERSHIPSTABLE = configParser.getConfig('destination_tables')['vo_memberships']

  def __init__(self, vo_id, userid, status, created, tenenv_id):
    self.community_id = vo_id
    self.hasheduserid = userid
    self.status = status
    self.tenenv_id = tenenv_id
    self.created = created

#   @classmethod
#   def getLastDate(self):
#     pgConn = destinationPgConnector()
#     result = pgConn.execute_select("SELECT max(created::date) FROM {0}".format(voMemberships.VOMEMBERSHIPSTABLE))
#     return result


  @classmethod
  def truncate(self, tenenv_id):
    pgConn = destinationPgConnector()
    # remove all data
    pgConn.execute_and_commit(
        """
        DELETE FROM {0} WHERE tenenv_id = {1}
        """.format(voMemberships.VOMEMBERSHIPSTABLE, tenenv_id)
    )
  
  @classmethod
  def saveAll(self, voMembershipsList):
    pgConn = destinationPgConnector()
    values = ''
    for item in voMembershipsList:
      values += """INSERT INTO {0}(community_id, hasheduserid, status, created, tenenv_id) 
      VALUES ('{1}', '{2}','{3}', '{4}', {5}) 
      ON CONFLICT(community_id, hasheduserid, tenenv_id) DO UPDATE SET status='{3}';
      """.format(voMemberships.VOMEMBERSHIPSTABLE, 
      item.community_id, 
      item.hasheduserid, 
      item.status,
      item.created,
      item.tenenv_id)
    pgConn.execute_and_commit(values)

  @classmethod
  def getMembershipStatus(self, voId, hasheduserid, tenenv_id):
    pgConn = destinationPgConnector()
    result = pgConn.execute_select("""
     SELECT status 
     FROM {0} 
     WHERE community_id={1} AND hasheduserid='{2}'
         AND tenenv_id={3}
     """
     .format(voMemberships.VOMEMBERSHIPSTABLE, voId, hasheduserid, tenenv_id))
    return result