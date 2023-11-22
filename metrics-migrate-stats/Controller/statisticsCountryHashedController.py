from datetime import date, timedelta
from multiprocessing.spawn import prepare
from Model.countries import countries
from Model.identityProvidersMap import identityProvidersMap
from Model.ipStatistics import ipStatistics
from Model.statisticsDetail import statisticsDetail
from Model.statistics import statistics
from Model.serviceProvidersMap import serviceProvidersMap
from Model.statisticsCountryHashed import statisticsCountryHashed
from Model.statisticsCountryHashedFromComanage import statisticsCountryHashedFromComanage
from datetime import datetime, timedelta
from Service.ipDatabase import geoip2Database
from Logger import log
import ipaddress

class statisticsCountryHashedController:
  logger = log.get_logger("statisticsCountryHashedController")

  @classmethod
  def saveAllData(self, tenenv_id):
    
    dateFrom = statisticsCountryHashed.getLastDate(tenenv_id)
    today = date.today()
    dateTo = today.strftime('%Y-%m-%d 23:59:59')
     # we dont have any country statistics saved
    if dateFrom[0][0] == None:
      result = ipStatistics.getStatsByDate(None, dateTo)
    else:
      dayAfter = dateFrom[0][0] + timedelta(days=1)
      dayFrom = dayAfter.strftime('%Y-%m-%d 00:00:00')
      
      yesterday = date.today() - timedelta(days=1)
      dateTo = yesterday.strftime('%Y-%m-%d 23:59:59')
      
      result = ipStatistics.getStatsByDate(dayFrom, dateTo)
    statisticsCountryHashedController.prepareData(result, tenenv_id)

    # now we would like to save those data we dont have ip information
    dateTo = statisticsCountryHashed.getFirstDate(tenenv_id)
    result = statisticsDetail.getStatsByDate(dateTo[0][0].strftime('%Y-%m-%d'))
    statisticsCountryHashedController.prepareData(result, tenenv_id)
    dateTo = statisticsCountryHashed.getFirstDate(tenenv_id)
    result = statistics.getStatsByDate(dateTo[0][0].strftime('%Y-%m-%d'))
    statisticsCountryHashedController.prepareData(result, tenenv_id)
    return result

  @classmethod
  def prepareData(self, data, tenenv_id):
    ipDatabaseHandler = geoip2Database()
    mappedItems = 0
    for item in data:
      ## find identityprovider id
      result = identityProvidersMap.getIdpIdByIdentifier(item.sourceidp, tenenv_id)
      if len(result) > 0:
        #self.logger.info(result[0][0])
        idpId = result[0][0]
      else:
        self.logger.error("Identity provider identifier not found {0}".format(item.sourceidp))
        continue

      ## find serviceprovider id
      result = serviceProvidersMap.getSpIdByIdentifier(item.service, tenenv_id)
      if len(result) > 0:
        #self.logger.info(result[0][0])
        spId = result[0][0]
      else:
        self.logger.warning("Service entityid {0} not found".format(item.service))
        spItem = serviceProvidersMap(item.service, item.service.replace("'", "''"), tenenv_id)
        serviceProvidersMap.save(spItem)
        self.logger.info("Service entityid {0} created".format(item.service))
      try:
          if hasattr(item, "ip"):
              ipaddr = ipaddress.ip_network(item.ip).network_address
          else:
              item.countrycode = countryData[0]
              item.country = countryData[1] 
          # get country code/ name
          countryData = ipDatabaseHandler.getCountryFromIp(str(ipaddr), item.ipVersion)
          if (countryData[0] == None):
              item.countrycode = "UN"
              item.country = "Unknown"
          else:
              item.countrycode = countryData[0]
              item.country = countryData[1]       
      except:
          item.countrycode = "UN"
          item.country = "Unknown"
       ## save country if not exists and get id
      country = countries(item.countrycode, item.country)
      countries.save(country)
      result = countries.getIdByCountryCode(item.countrycode)   
      if len(result) > 0:
        #self.logger.info(result[0][0])
        countryId = result[0][0]
      else:
        self.logger.error("Country not found")
        continue
      self.logger.info("{0} ".format(item.date))
      
      if hasattr(item, "count"):
        count = item.count
      else:
        count = 1
      statsCountry = statisticsCountryHashed(item.date, item.hasheduserid, idpId, spId, countryId, count, tenenv_id)
      statisticsCountryHashed.save(statsCountry)
      mappedItems += 1
    self.logger.info("{0} Country Stats created".format(mappedItems))



    
