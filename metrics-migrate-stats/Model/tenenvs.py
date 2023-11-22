from Model.pgConnector import destinationPgConnector
from Utils import configParser
from Logger import log
class tenenvs(object):
  logger = log.get_logger("tenenvs")
  TENANTSTABLE = configParser.getConfig('destination_tables')['tenenvs']
  
  def __init__(self, name, description, tenant_id, env_id): 
    self.name = name
    self.description = description
    self.tenant_id = tenant_id
    self.env_id = env_id

  @classmethod
  def save(self, tenenv):
    pgConn = destinationPgConnector() 
    pgConn.execute_and_commit(
      """
      INSERT INTO {0}(name, description, tenant_id, env_id) 
        VALUES ('{1}', '{2}', {3}, {4}) 
        ON CONFLICT DO NOTHING
      """.format(tenenvs.TENANTSTABLE, 
      tenenv.name, tenenv.description, tenenv.tenant_id, tenenv.env_id)    
    )

  @classmethod
  def getTenenvByTenantIdAndEnvId(self, tenant_id, env_id):
    pgConn = destinationPgConnector()
    result = pgConn.execute_select("""
    SELECT id FROM {0} WHERE tenant_id={1} AND env_id={2}""".format(
        tenenvs.TENANTSTABLE, tenant_id, env_id))
    return result
