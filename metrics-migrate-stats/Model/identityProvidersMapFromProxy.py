from Model.pgConnector import sourcePgConnectorProxy
from Utils import configParser

class identityProvidersMapFromProxy(object):
  IDPPROXYTABLE = configParser.getConfig('source_tables')['identity_providers_map_proxy']
  def __init__(self, entityid, name):
    self.entityid = entityid
    self.name = name

  @classmethod
  def getAllIdps(self):
    pgConn = sourcePgConnectorProxy()
    result = list(pgConn.execute_select("SELECT entityid, name FROM {0}".format(identityProvidersMapFromProxy.IDPPROXYTABLE)))
    data = []
    for row in result:
      idpsData = identityProvidersMapFromProxy(row[0], row[1])
      data.append(idpsData)
    return data


