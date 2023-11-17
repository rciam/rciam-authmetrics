from Model.pgConnector import sourcePgConnectorProxy
from Utils import configParser
from datetime import date, timedelta
import hashlib
class statistics(object):
  STATISTICSTABLE = configParser.getConfig('source_tables')['statistics']
  def __init__(self, date, sourceIdp, service,  count):
    self.date = date
    self.sourceidp = sourceIdp
    self.service = service
    self.hasheduserid = "unknown"
    self.count = count
  @classmethod
  def getStatsByDate(self, dateTo):
    pgConn = sourcePgConnectorProxy()
    print(dateTo)
    result = list(pgConn.execute_select("SELECT year,month,day, sourceidp, service, count FROM {0} WHERE  CAST(CONCAT(year,'-',LPAD(CAST(month AS varchar),2,'0'),'-',LPAD(CAST(day AS varchar),2,'0')) AS date) < '{1}' ".format(statistics.STATISTICSTABLE, dateTo)))
    data = []
    for row in result:
      dateCol = [row[0], row[1], row[2]]
      ipData = statistics('-'.join(map(str, dateCol)), row[3], row[4], row[5])
      data.append(ipData)
    return data

 