from datetime import date, timedelta
from multiprocessing.spawn import prepare
from Model.countries import countries
from Model.identityProvidersMap import identityProvidersMap
from Model.serviceProvidersMap import serviceProvidersMap
from Model.statisticsCountryHashed import statisticsCountryHashed
from Model.statisticsCountryHashedFromComanage import statisticsCountryHashedFromComanage
from datetime import datetime, timedelta
from Logger import log

class statisticsCountryHashedController:
  logger = log.get_logger("statisticsCountryHashedController")

  @classmethod
  def saveAllData(self):
    
    dateFrom = statisticsCountryHashed.getLastDate()
    today = date.today()
    dateTo = today.strftime('%Y-%m-%d 23:59:59')
     # we dont have any country statistics saved
    if dateFrom[0][0] == None:
      result = statisticsCountryHashedFromComanage.getStatsByDate(None, dateTo)
    else:
      dayAfter = dateFrom[0][0] + timedelta(days=1)
      dayFrom = dayAfter.strftime('%Y-%m-%d 00:00:00')
      
      yesterday = date.today() - timedelta(days=1)
      dateTo = yesterday.strftime('%Y-%m-%d 23:59:59')
      
      result = statisticsCountryHashedFromComanage.getStatsByDate(dayFrom, dateTo)
    statisticsCountryHashedController.prepareData(result)
    return result

  @classmethod
  def prepareData(self, data):
    mappedItems = 0
    for item in data:
      ## find identityprovider id
      result = identityProvidersMap.getIdpIdByIdentifier(item.sourceidp)
      if len(result) > 0:
        #self.logger.info(result[0][0])
        idpId = result[0][0]
      else:
        self.logger.error("Identity provider identifier not found")
        continue

      ## find serviceprovider id
      result = serviceProvidersMap.getSpIdByIdentifier(item.service)
      if len(result) > 0:
        #self.logger.info(result[0][0])
        spId = result[0][0]
      else:
        self.logger.error("Service entityid {0} not found".format(item.service))
        continue
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
      statsCountry = statisticsCountryHashed(item.date, item.hasheduserid, idpId, spId, countryId, item.count)
      statisticsCountryHashed.save(statsCountry)
      mappedItems += 1
    self.logger.info("{0} Country Stats created".format(mappedItems))



    
