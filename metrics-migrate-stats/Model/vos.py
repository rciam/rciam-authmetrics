from Model.pgConnector import destinationPgConnector
from Utils import configParser
from Logger import log
class vos(object):
  logger = log.get_logger("vos")
  VOSTABLE = configParser.getConfig('destination_tables')['vos']
  VOSINFORMATIONTABLE = configParser.getConfig('destination_tables')['vos_information']

  def __init__(self, id, created, tenenv_id):
    self.community_id = id #foreign key coming from vosInfo
    self.created = created
    self.tenenv_id = tenenv_id

  @classmethod
  def getVoIdFromVoName(self, voName, source, tenenv_id):
    pgConn = destinationPgConnector()
    
    result = pgConn.execute_select("""
      SELECT id FROM {0} JOIN {1} ON id=community_id
       WHERE source='{2}' AND name='{3}' AND {0}.tenenv_id={4}
    """.format(vos.VOSTABLE, vos.VOSINFORMATIONTABLE, source, voName, tenenv_id))
    return result

  @classmethod
  def getLastDate(self, tenenv_id):
    pgConn = destinationPgConnector()
    result = pgConn.execute_select("""
    SELECT max(created::date) FROM {0} WHERE tenenv_id={1}
    """.format(vos.VOSTABLE, tenenv_id))
    return result

  @classmethod
  def save(self, vos):
    pgConn = destinationPgConnector()  
    pgConn.execute_and_commit(
      "INSERT INTO {0}(community_id, created, status, tenenv_id) VALUES ('{1}', '{2}', '{3}', {4})".format(vos.VOSTABLE, vos.community_id, vos.created, 'A', vos.tenenv_id)
    )
    
  
#   @classmethod
#   def saveAll(self, vosList):
#     pgConn = destinationPgConnector()
#     values = ''
#     for item in vosList:
#       values += "INSERT INTO {0}(created, source) VALUES ('{1}', '{2}');".format(vos.VOSTABLE, item.created, item.source)
#     pgConn.execute_and_commit(values)
