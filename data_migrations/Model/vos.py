from Model.pgConnector import destinationPgConnector
from Utils import configParser
from Logger import log
class vos(object):
  logger = log.get_logger("vos")
  VOSTABLE = configParser.getConfig('destination_tables')['vos']

  def __init__(self, id, created):
    self.community_id = id #foreign key coming from vosInfo
    self.created = created


  @classmethod
  def getVoIdFromVoName(self, voName, source):
    pgConn = destinationPgConnector()
    
    result = pgConn.execute_select("""
      SELECT id FROM communities JOIN communities_info ON id=community_id
       WHERE source='{0}' AND name='{1}'
    """.format(source, voName))
    return result

  @classmethod
  def getLastDate(self):
    pgConn = destinationPgConnector()
    result = pgConn.execute_select("SELECT max(created::date) FROM {0}".format(vos.VOSTABLE))
    return result

  @classmethod
  def save(self, vos):
    pgConn = destinationPgConnector()  
    pgConn.execute_and_commit(
      "INSERT INTO {0}(community_id, created) VALUES ('{1}', '{2}')".format(vos.VOSTABLE, vos.community_id, vos.created)
    )
    
  
#   @classmethod
#   def saveAll(self, vosList):
#     pgConn = destinationPgConnector()
#     values = ''
#     for item in vosList:
#       values += "INSERT INTO {0}(created, source) VALUES ('{1}', '{2}');".format(vos.VOSTABLE, item.created, item.source)
#     pgConn.execute_and_commit(values)
