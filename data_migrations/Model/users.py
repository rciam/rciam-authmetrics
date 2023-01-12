from Model.pgConnector import destinationPgConnector
from Utils import configParser
from Logger import log
import hashlib
class users(object):
  logger = log.get_logger("users")
  USERSTABLE = configParser.getConfig('destination_tables')['users']

  def __init__(self, userid, created, status):
    
    self.hasheduserid = userid
    self.created = created
    self.status = status

#   @classmethod
#   def getLastDate(self):
#     pgConn = destinationPgConnector()
#     result = pgConn.execute_select("SELECT max(created::date) FROM {0}".format(voMemberships.VOMEMBERSHIPSTABLE))
#     return result



  @classmethod
  def saveAll(self, usersList):
    pgConn = destinationPgConnector()
    values = ''
    for item in usersList:
      values += """INSERT INTO {0}(hasheduserid, created, status) 
      VALUES ('{1}', '{2}','{3}') 
      ON CONFLICT(hasheduserid) DO UPDATE SET status='{3}';
      """.format(users.USERSTABLE, item.hasheduserid, item.created, item.status)
    pgConn.execute_and_commit(values)

#   @classmethod
#   def getMembershipStatus(self, voId, hasheduserid):
#     pgConn = destinationPgConnector()
#     result = pgConn.execute_select("""
#      SELECT status FROM {0} WHERE community_id={1} AND hasheduserid='{2}'"""
#      .format(users.USERSTABLE, voId, hasheduserid))
#     return result