from Model.pgConnector import destinationPgConnector
from Utils import configParser
from Logger import log
class serviceProvidersMap(object):
  logger = log.get_logger("serviceProvidersMap")
  SERVICEPROVIDERSMAPTABLE = configParser.getConfig('destination_tables')['service_providers_map']
  
  def __init__(self, identifier, name, tenenv_id): 
    self.identifier = identifier
    self.name = name
    self.tenenv_id = tenenv_id


  @classmethod
  def save(self, serviceProviderMap):
    pgConn = destinationPgConnector() 
    pgConn.execute_and_commit(
      """INSERT INTO {0}(identifier, name, tenenv_id) 
           VALUES ('{1}', '{2}', {3}) ON CONFLICT DO NOTHING
      """.format(serviceProviderMap.SERVICEPROVIDERSMAPTABLE, 
      serviceProviderMap.identifier, serviceProviderMap.name,
      serviceProviderMap.tenenv_id)
    )

  @classmethod
  def getSpIdByIdentifier(self, identifier, tenenv_id):
    pgConn = destinationPgConnector()
    result = pgConn.execute_select("""
    SELECT id FROM {0} WHERE identifier='{1}'
    AND tenenv_id={2}
    """.format(serviceProvidersMap.SERVICEPROVIDERSMAPTABLE, identifier, tenenv_id))
    return result
