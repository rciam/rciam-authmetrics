from Model.pgConnector import sourcePgConnectorProxy
from Utils import configParser
from datetime import date, timedelta
import hashlib
class ipStatistics(object):
  IPSTATISTICSTABLE = configParser.getConfig('source_tables')['ip_table']
  def __init__(self, accessed, sourceIdp, service, userid, ip, ipVersion):
    self.date = accessed
    self.sourceidp = sourceIdp
    self.service = service
    self.hasheduserid = userid
    self.ip = ip
    self.ipVersion = ipVersion
  
  @classmethod
  def getIpStatisticsByDate(self, dateFrom, dateTo):
    pgConn = sourcePgConnectorProxy()
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
    pgConn = sourcePgConnectorProxy()
    result = list(pgConn.execute_select("SELECT accessed::date, sourceidp, service, userid, ip, ipversion FROM {0} WHERE accessed::date <= '{1}'".format(ipStatistics.IPSTATISTICSTABLE, dateTo)))
    data = []
    for row in result:
      ipData = ipStatistics(row[0], row[1], row[2], row[3], row[4], row[5])
      data.append(ipData)
    return data
  
  @classmethod
  def getStatsByDate(self, dateFrom, dateTo ):
    pgConn = sourcePgConnectorProxy()
    if(dateFrom != None):
      result = list(pgConn.execute_select("""SELECT accessed::date, sourceidp, service, userid, ip, ipversion 
                                          FROM {0} WHERE accessed::date BETWEEN  '{1}' 
                                          AND '{2}'""".format(ipStatistics.IPSTATISTICSTABLE, dateFrom, dateTo)))
      
    else:
      result = list(pgConn.execute_select("""SELECT accessed::date, sourceidp, service, userid, ip, ipversion 
                                          FROM {0} WHERE accessed::date <= '{1}'"""
                                          .format(ipStatistics.IPSTATISTICSTABLE, dateTo)))
    data = []
    for row in result:
      statsData = ipStatistics(row[0], row[1], row[2], hashlib.md5(row[3].encode()).hexdigest(), row[4], row[5])
      data.append(statsData)
    return data


