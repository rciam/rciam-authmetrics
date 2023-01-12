from Model.pgConnector import destinationPgConnector
from Utils import configParser
from Logger import log
class statisticsCountryHashed(object):
  logger = log.get_logger("statisticsCountryHashed")
  STATISTICSCOUNTRYHASHEDTABLE = configParser.getConfig('destination_tables')['statistics_country_hashed']
  
  def __init__(self, date, hasheduserid, sourceidpid, serviceid, countryid, count):
    self.date = date
    self.hasheduserid = hasheduserid
    self.sourceidpid = sourceidpid
    self.serviceid = serviceid
    self.countryid = countryid
    self.count = count

  @classmethod
  def getLastDate(self):
    pgConn = destinationPgConnector()
    result = pgConn.execute_select("SELECT max(date::date) FROM {0}".format(statisticsCountryHashed.STATISTICSCOUNTRYHASHEDTABLE))
    return result

  @classmethod
  def save(self, statisticsCountryHashed):
    pgConn = destinationPgConnector() 
    pgConn.execute_and_commit(
      """INSERT INTO {0}(date, hasheduserid, sourceidpid, serviceid, countryid, count) 
            VALUES ('{1}', '{2}', {3}, {4}, {5}, {6}) 
            """.format(statisticsCountryHashed.STATISTICSCOUNTRYHASHEDTABLE, 
            statisticsCountryHashed.date, 
            statisticsCountryHashed.hasheduserid,
            statisticsCountryHashed.sourceidpid,
            statisticsCountryHashed.serviceid,
            statisticsCountryHashed.countryid,
            statisticsCountryHashed.count,
            )
    )
