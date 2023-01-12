from Model.pgConnector import destinationPgConnector
from Utils import configParser
from Logger import log
class serviceProvidersMap(object):
  logger = log.get_logger("serviceProvidersMap")
  SERVICEPROVIDERSMAPTABLE = configParser.getConfig('destination_tables')['service_providers_map']
  
  def __init__(self, identifier, name): 
    self.identifier = identifier
    self.name = name


  @classmethod
  def save(self, serviceProviderMap):
    pgConn = destinationPgConnector() 
    pgConn.execute_and_commit(
      "INSERT INTO {0}(identifier, name) VALUES ('{1}', '{2}') ON CONFLICT DO NOTHING".format(serviceProviderMap.SERVICEPROVIDERSMAPTABLE, serviceProviderMap.identifier, serviceProviderMap.name)
    )

  @classmethod
  def getSpIdByIdentifier(self, identifier):
    pgConn = destinationPgConnector()
    result = pgConn.execute_select("SELECT id FROM {0} WHERE identifier='{1}'".format(serviceProvidersMap.SERVICEPROVIDERSMAPTABLE, identifier))
    return result
