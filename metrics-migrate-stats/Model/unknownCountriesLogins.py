from Model.pgConnector import sourcePgConnectorProxy
from Model.statisticsCountryHashedFromComanage import statisticsCountryHashedFromComanage
from Utils import configParser
from datetime import date, timedelta
import hashlib

class unknownCoutriesLogins(object):
  IPTABLE = configParser.getConfig('source_tables')['ip_table']
  def __init__(self, date, userid, sourceidp, service, count):
    self.userid = userid
    self.accessed = date
    self.sourceidp = sourceidp
    self.service = service
    self.count = count
  
  @classmethod
  def getStatsByDate(self, sourceidp, service, date):
    pgConn = sourcePgConnectorProxy()
    
    result = list(pgConn.execute_select("SELECT accessed::date, userid, sourceidp, service, count(*) as count FROM {0} WHERE accessed::date='{1}' AND sourceidp='{2}' AND service='{3}' group by accessed::date, userid,sourceidp,service"
                                        .format(unknownCoutriesLogins.IPTABLE, date, sourceidp, service)))
    data = []
    for row in result:
        # statsData = unknownCoutriesLogins(row[0], hashlib.md5(row[1].encode()).hexdigest(), row[2], row[3], row[4])
        data[hashlib.md5(row[1].encode()).hexdigest()] = row[4]
        # data.append(statsData)
    return data


