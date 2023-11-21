from Model.pgConnector import sourcePgConnector
from Utils import configParser
from datetime import date, timedelta

class statisticsCountryHashedFromComanage(object):
  STATISTICSCOUNTRYHASHEDCOMANAGETABLE = configParser.getConfig('source_tables')['statistics_country_hashed_comanage']
  def __init__(self, date, hasheduserid, sourceidp, service, countrycode, country, count):
    self.hasheduserid = hasheduserid
    self.date = date
    self.sourceidp = sourceidp
    self.service = service
    self.countrycode = countrycode
    self.country = country
    self.count = count
  
  @classmethod
  def getStatsByDate(self, dateFrom, dateTo ):
    pgConn = sourcePgConnector()
    if(dateFrom != None):
      result = list(pgConn.execute_select("SELECT date::date, hasheduserid, sourceidp, service, countrycode, country, count FROM {0} WHERE date::date BETWEEN  '{1}' AND '{2}'".format(statisticsCountryHashedFromComanage.STATISTICSCOUNTRYHASHEDCOMANAGETABLE, dateFrom, dateTo)))
      
    else:
      result = list(pgConn.execute_select("SELECT date::date, hasheduserid, sourceidp, service, countrycode, country, count FROM {0} WHERE date::date <= '{1}'".format(statisticsCountryHashedFromComanage.STATISTICSCOUNTRYHASHEDCOMANAGETABLE, dateTo)))
    data = []
    for row in result:
      statsData = statisticsCountryHashedFromComanage(row[0], row[1], row[2], row[3], row[4], row[5], row[6])
      data.append(statsData)
    return data


