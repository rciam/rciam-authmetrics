from Model.pgConnector import destinationPgConnector
from Utils import configParser
from Logger import log
class identityProvidersMap(object):
  logger = log.get_logger("identityProvidersMap")
  IDENTITYPROVIDERSMAPTABLE = configParser.getConfig('destination_tables')['identity_providers_map']
  
  def __init__(self, entityid, name): 
    self.entityid = entityid
    self.name = name


  @classmethod
  def save(self, identityProviderMap):
    pgConn = destinationPgConnector() 
    pgConn.execute_and_commit(
      "INSERT INTO {0}(entityid, name) VALUES ('{1}', '{2}') ON CONFLICT DO NOTHING".format(identityProviderMap.IDENTITYPROVIDERSMAPTABLE, identityProviderMap.entityid, identityProviderMap.name)
    )

  @classmethod
  def getIdpIdByIdentifier(self, entityid):
    pgConn = destinationPgConnector()
    result = pgConn.execute_select("SELECT id FROM {0} WHERE entityid='{1}'".format(identityProvidersMap.IDENTITYPROVIDERSMAPTABLE, entityid))
    return result
