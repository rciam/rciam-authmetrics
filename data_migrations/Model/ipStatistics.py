from Model.pgConnector import sourcePgConnector
from Utils import configParser
from datetime import date, timedelta

class ipStatistics(object):
  IPSTATISTICSTABLE = configParser.getConfig('source_tables')['ip_table']
  def __init__(self, accessed, sourceIdp, service, userid, ip, ipVersion):
    self.accessed = accessed
    self.sourceIdp = sourceIdp
    self.service = service
    self.userid = userid
    self.ip = ip
    self.ipVersion = ipVersion
  
  @classmethod
  def getIpStatisticsByDate(self, dateFrom, dateTo):
    pgConn = sourcePgConnector()
    if(dateFrom != None):
      result = list(pgConn.execute_select("SELECT accessed::date, sourceidp, service, userid, ip, ipversion FROM {0} WHERE accessed::date BETWEEN  '{1}' AND '{2}'".format(ipStatistics.IPSTATISTICSTABLE, dateFrom, dateTo)))
    else:
      result = list(pgConn.execute_select("SELECT accessed::date, sourceidp, service, userid, ip, ipversion FROM {0} WHERE accessed::date <= '{1}'".format(ipStatistics.IPSTATISTICSTABLE, dateTo)))
    data = []
    for row in result:
      ipData = ipStatistics(row[0], row[1], row[2], row[3], row[4], row[5])
      data.append(ipData)
    return data

  @classmethod
  def getAllIpStatistics(self):
    yesterday = date.today() - timedelta(days=1)
    dateTo = yesterday.strftime('%Y-%m-%d 23:59:59')
    pgConn = sourcePgConnector()
    result = list(pgConn.execute_select("SELECT accessed::date, sourceidp, service, userid, ip, ipversion FROM {0} WHERE accessed::date <= '{1}'".format(ipStatistics.IPSTATISTICSTABLE, dateTo)))
    data = []
    for row in result:
      ipData = ipStatistics(row[0], row[1], row[2], row[3], row[4], row[5])
      data.append(ipData)
    return data


