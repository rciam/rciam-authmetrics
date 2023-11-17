from Model.pgConnector import destinationPgConnector
from Utils import configParser
from Logger import log
class environments(object):
  logger = log.get_logger("environments")
  ENVIRONMENTSTABLE = configParser.getConfig('destination_tables')['environments']
  
  def __init__(self, name, description): 
    self.name = name
    self.description = description

  @classmethod
  def save(self, environment):
    pgConn = destinationPgConnector() 
    pgConn.execute_and_commit(
      """
      INSERT INTO {0}(name, description) 
        VALUES ('{1}', '{2}') 
        ON CONFLICT DO NOTHING
      """.format(environments.ENVIRONMENTSTABLE, 
      environment.name, environment.description)    
    )

  @classmethod
  def getEnvironmentByName(self, name):
    pgConn = destinationPgConnector()
    result = pgConn.execute_select("""
    SELECT id FROM {0} WHERE name='{1}'""".format(
        environments.ENVIRONMENTSTABLE, name))
    return result
