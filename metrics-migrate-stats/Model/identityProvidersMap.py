from Model.pgConnector import destinationPgConnector
from Utils import configParser
from Logger import log
class identityProvidersMap(object):
  logger = log.get_logger("identityProvidersMap")
  IDENTITYPROVIDERSMAPTABLE = configParser.getConfig('destination_tables')['identity_providers_map']
  
  def __init__(self, entityid, name, tenenv_id): 
    self.entityid = entityid
    self.name = name
    self.tenenv_id = tenenv_id

  def __str__(self):
    return f"IdentityProvidersMap(entityid={self.entityid}, name={self.name}, tenenv_id={self.tenenv_id})"

  def __getitem__(self, key):
    return getattr(self, key, None)
    
  @classmethod
  def save(self, identityProviderMap):
    pgConn = destinationPgConnector() 
    pgConn.execute_and_commit(
      f"""
      INSERT INTO {identityProviderMap.IDENTITYPROVIDERSMAPTABLE} (entityid, name, tenenv_id) 
       VALUES (%(entityid)s, %(name)s, %(tenenv_id)s) 
        ON CONFLICT DO NOTHING;
      """, identityProviderMap)

  @classmethod
  def getIdpIdByIdentifier(self, entityid, tenenv_id):
    pgConn = destinationPgConnector()
    result = pgConn.execute_select("""
    SELECT id FROM {0} WHERE entityid='{1}' AND tenenv_id={2}""".format(
        identityProvidersMap.IDENTITYPROVIDERSMAPTABLE, entityid, tenenv_id))
    return result
