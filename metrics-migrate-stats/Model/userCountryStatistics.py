from Model.pgConnector import destinationPgConnector
from Utils import configParser
class userCountryStatistics(object):
  USERCOUNTRYTABLE = configParser.getConfig('destination_tables')['user_country_table']

  def __init__(self, id, date, userid, countrycode, country, count):
    self.id = id
    self.date = date
    self.userid = userid
    self.countrycode = countrycode
    self.country = country
    self.count = count

  @classmethod
  def getLastDate(self):
    pgConn = destinationPgConnector()
    result = pgConn.execute_select("SELECT max(date::date) FROM {0}".format(userCountryStatistics.USERCOUNTRYTABLE))
    return result

  @classmethod
  def save(self, userCountryStatistics):
    pgConn = destinationPgConnector()
    pgConn.execute_and_commit(
      "INSERT INTO {0}(date, userid, countrycode, country, count) VALUES ('{1}', '{2}', '{3}', '{4}', {5}) ON CONFLICT (date, userid, countrycode) DO UPDATE SET count = {0}.count + 1".format(userCountryStatistics.USERCOUNTRYTABLE, userCountryStatistics.date, userCountryStatistics.userid, userCountryStatistics.countrycode, userCountryStatistics.country, 1)
    )

  @classmethod
  def saveAll(self, userCountryStatisticsList):
    pgConn = destinationPgConnector()
    values = ''
    for item in userCountryStatisticsList:
      values += "INSERT INTO {0}(date, userid, countrycode, country, count) VALUES ('{1}', '{2}', '{3}', '{4}', {5}) ON CONFLICT (date, userid, countrycode) DO UPDATE SET count = {0}.count + 1;".format(userCountryStatistics.USERCOUNTRYTABLE, item.date, item.userid, item.countrycode, item.country, 1)
    pgConn.execute_and_commit(values)