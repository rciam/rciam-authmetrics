from Model.pgConnector import destinationPgConnector
from Utils import configParser
from Logger import log
class vosInfo(object):
  logger = log.get_logger("vosInfo")
  VOSINFOTABLE = configParser.getConfig('destination_tables')['vos_information']
  
  def __init__(self, voName, voDescription, status, source, tenenv_id):
    
    self.voName = voName
    self.voDescription = voDescription
    self.source = source
    self.tenenv_id = tenenv_id

  @classmethod
  def save(self, vosInfo):
    pgConn = destinationPgConnector() 
    id = pgConn.execute_and_commit_with_fetch(
      """INSERT INTO {0}(name, description, source, tenenv_id) 
      VALUES ('{1}', '{2}', '{3}', {4}) ON CONFLICT DO NOTHING 
      RETURNING id""".format(
        vosInfo.VOSINFOTABLE,
        vosInfo.voName,
        vosInfo.voDescription,
        vosInfo.source,
        vosInfo.tenenv_id)
    )
    return id
  
#   @classmethod
#   def saveAll(self, vosList):
#     pgConn = destinationPgConnector()
#     values = ''
#     for item in vosList:
#       values += "INSERT INTO {0}(community_id, name, description) VALUES ('{1}', '{2}', '{3}');".format(vosInfo.VOSINFOTABLE, item.id, item.voName, item.voDescription)
#     pgConn.execute_and_commit(values)
