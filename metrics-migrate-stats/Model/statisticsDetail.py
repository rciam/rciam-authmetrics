from Model.pgConnector import sourcePgConnectorProxy
from Utils import configParser
from datetime import date, timedelta
import hashlib
class statisticsDetail(object):
  STATISTICSDETAILTABLE = configParser.getConfig('source_tables')['statistics_detail']
  def __init__(self, date, sourceIdp, service, userid, count):
    self.date = date
    self.sourceidp = sourceIdp
    self.service = service
    self.hasheduserid = userid
    self.count = count
  @classmethod
  def getStatsByDate(self, dateTo):
    pgConn = sourcePgConnectorProxy()
    print(dateTo)
    result = list(pgConn.execute_select("SELECT year,month,day, sourceidp, service, userid FROM {0} WHERE  CAST(CONCAT(year,'-',LPAD(CAST(month AS varchar),2,'0'),'-',LPAD(CAST(day AS varchar),2,'0')) AS date) < '{1}' ".format(statisticsDetail.STATISTICSDETAILTABLE, dateTo)))
    data = []
    for row in result:
      ipData = statisticsDetail(row[0]+'-'+row[1]+'-'+row[2], row[3], row[4], row[5])
      data.append(ipData)
    return data

 