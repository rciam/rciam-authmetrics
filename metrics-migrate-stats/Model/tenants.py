from Model.pgConnector import destinationPgConnector
from Utils import configParser
from Logger import log
class tenants(object):
  logger = log.get_logger("tenants")
  TENANTSTABLE = configParser.getConfig('destination_tables')['tenants']
  
  def __init__(self, name, description): 
    self.name = name
    self.description = description

  @classmethod
  def save(self, tenant):
    pgConn = destinationPgConnector() 
    pgConn.execute_and_commit(
      """
      INSERT INTO {0}(name, description) 
        VALUES ('{1}', '{2}') 
        ON CONFLICT DO NOTHING
      """.format(tenants.TENANTSTABLE, 
      tenant.name, tenant.description)    
    )

  @classmethod
  def getTenantByName(self, name):
    pgConn = destinationPgConnector()
    result = pgConn.execute_select("""
    SELECT id FROM {0} WHERE name='{1}'""".format(
         tenants.TENANTSTABLE, name))
    return result
