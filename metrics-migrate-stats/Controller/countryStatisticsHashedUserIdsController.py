from datetime import date, timedelta
from Model.ipStatistics import ipStatistics
from Model.countryStatisticsHashedUserId import countryStatisticsHashedUserId
from datetime import datetime, timedelta
class countryStatisticsHashedUserIdsController:
  @classmethod
  def getDataNotMapped(self):
    dateFrom = countryStatisticsHashedUserId.getLastDate()
    
    # we dont have any country statistics saved
    if dateFrom[0][0] == None:
      result = ipStatistics.getAllIpStatistics()
    else:
      dayAfter = dateFrom[0][0] + timedelta(days=1)
      dayFrom = dayAfter.strftime('%Y-%m-%d 00:00:00')
      
      yesterday = date.today() - timedelta(days=1)
      dateTo = yesterday.strftime('%Y-%m-%d 23:59:59')
      
      result = ipStatistics.getIpStatisticsByDate(dayFrom, dateTo)
    return result

    
