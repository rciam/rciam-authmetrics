from Model.pgConnector import destinationPgConnector
from Utils import configParser
from Logger import log
class statisticsCountryHashed(object):
  logger = log.get_logger("statisticsCountryHashed")
  STATISTICSCOUNTRYHASHEDTABLE = configParser.getConfig('destination_tables')['statistics_country_hashed']
  
  def __init__(self, date, hasheduserid, sourceidpid, serviceid, countryid, count, tenenv_id):
    self.date = date
    self.hasheduserid = hasheduserid
    self.sourceidpid = sourceidpid
    self.serviceid = serviceid
    self.countryid = countryid
    self.count = count
    self.tenenv_id = tenenv_id

  @classmethod
  def getLastDate(self, tenenv_id):
    pgConn = destinationPgConnector()
    result = pgConn.execute_select("""
    SELECT max(date::date) FROM {0} 
        WHERE tenenv_id={1}
    """.format(statisticsCountryHashed.STATISTICSCOUNTRYHASHEDTABLE, tenenv_id))
    return result
  
  @classmethod
  def getFirstDate(self, tenenv_id):
    pgConn = destinationPgConnector()
    result = pgConn.execute_select("""
    SELECT min(date::date) FROM {0} 
        WHERE tenenv_id={1}
    """.format(statisticsCountryHashed.STATISTICSCOUNTRYHASHEDTABLE, tenenv_id))
    return result

  @classmethod
  def save(self, statisticsCountryHashed):
    pgConn = destinationPgConnector() 
    pgConn.execute_and_commit(
      """INSERT INTO {0}(date, hasheduserid, sourceidpid, serviceid, countryid, count, tenenv_id) 
            VALUES ('{1}', '{2}', {3}, {4}, {5}, {6}, {7})  ON CONFLICT (date, hasheduserid, sourceidpid, serviceid, countryid, tenenv_id) 
            DO UPDATE SET count = {0}.count + 1
            """.format(statisticsCountryHashed.STATISTICSCOUNTRYHASHEDTABLE, 
            statisticsCountryHashed.date, 
            statisticsCountryHashed.hasheduserid,
            statisticsCountryHashed.sourceidpid,
            statisticsCountryHashed.serviceid,
            statisticsCountryHashed.countryid,
            statisticsCountryHashed.count,
            statisticsCountryHashed.tenenv_id
            )
    )

  @classmethod
  def getStatsByDate(self, sourceidp, service, dateFrom, dateTo, tenenv_id):
    pgConn = destinationPgConnector()
    
    result = list(pgConn.execute_select("""SELECT date::date, hasheduserid, sourceidp, service, count 
                                        FROM {0} WHERE date::date BETWEEN '{1}' AND '{2}' 
                                        AND sourceidp='{2}' AND service='{3}' AND tenenv_id={4}
                                        group by date::date, hasheduserid, sourceidp,service,count"""
                                        .format(statisticsCountryHashed.STATISTICSCOUNTRYHASHEDTABLE, dateFrom, dateTo, sourceidp, service, tenenv_id)))
    data = []
    for row in result:
        statsData = statisticsCountryHashed(row[0], row[1], row[2], row[3], "N", row[4], 0)
        data.append(statsData)
    return data
