from Model.pgConnector import sourcePgConnectorProxy
from Utils import configParser

class serviceProvidersMapFromProxy(object):
  SPPROXYTABLE = configParser.getConfig('source_tables')['service_providers_map_proxy']
  def __init__(self, identifier, name):
    self.identifier = identifier
    self.name = name

  @classmethod
  def getAllSps(self):
    pgConn = sourcePgConnectorProxy()
    result = list(pgConn.execute_select("SELECT identifier, name FROM {0}".format(serviceProvidersMapFromProxy.SPPROXYTABLE)))
    data = []
    for row in result:
      spsData = serviceProvidersMapFromProxy(row[0], row[1])
      data.append(spsData)
    return data


