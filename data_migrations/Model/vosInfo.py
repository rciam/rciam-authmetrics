from Model.pgConnector import destinationPgConnector
from Utils import configParser
from Logger import log
class vosInfo(object):
  logger = log.get_logger("vosInfo")
  VOSINFOTABLE = configParser.getConfig('destination_tables')['vos_information']
  
  def __init__(self, voName, voDescription, source):
    
    self.voName = voName
    self.voDescription = voDescription
    self.source = source

  @classmethod
  def save(self, vosInfo):
    pgConn = destinationPgConnector() 
    id = pgConn.execute_and_commit_with_fetch(
      "INSERT INTO {0}(name, description, source) VALUES ('{1}', '{2}', '{3}')  RETURNING id".format(vosInfo.VOSINFOTABLE, vosInfo.voName, vosInfo.voDescription, vosInfo.source)
    )
    return id
  
#   @classmethod
#   def saveAll(self, vosList):
#     pgConn = destinationPgConnector()
#     values = ''
#     for item in vosList:
#       values += "INSERT INTO {0}(community_id, name, description) VALUES ('{1}', '{2}', '{3}');".format(vosInfo.VOSINFOTABLE, item.id, item.voName, item.voDescription)
#     pgConn.execute_and_commit(values)
