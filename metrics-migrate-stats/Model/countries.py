from Model.pgConnector import destinationPgConnector
from Utils import configParser
from Logger import log
class countries(object):
  logger = log.get_logger("countries")
  COUNTRIESTABLE = configParser.getConfig('destination_tables')['countries']
  
  def __init__(self, countrycode, country): 
    self.countrycode = countrycode
    self.country = country


  @classmethod
  def save(self, countries):
    pgConn = destinationPgConnector() 
    pgConn.execute_and_commit(
      "INSERT INTO {0}(countrycode, country) VALUES ('{1}', '{2}') ON CONFLICT DO NOTHING".format(countries.COUNTRIESTABLE, countries.countrycode, countries.country)
    )

  @classmethod
  def getIdByCountryCode(self, countryCode):
    pgConn = destinationPgConnector() 
    result = pgConn.execute_select(
      "SELECT id FROM {0} WHERE countrycode='{1}'".format(countries.COUNTRIESTABLE, countryCode)
    )
    return result

