# from Model.pgConnector import destinationPgConnector
# from Utils import configParser
# class countryStatistics(object):
#   STATISTICSTABLE = configParser.getConfig('destination_tables')['countries']

#   def __init__(self, id, date, sourceIdp, service, countryCode, country, count):
#     self.id = id
#     self.date = date
#     self.service = service
#     self.sourceIdp = sourceIdp
#     self.countrycode = countryCode
#     self.country = country
#     self.count = count

#   @classmethod
#   def getLastDate(self):
#     pgConn = destinationPgConnector()
#     result = pgConn.execute_select("SELECT max(date::date) FROM {0}".format(countryStatistics.STATISTICSTABLE))
#     return result

#   @classmethod
#   def save(self, countryStatistics):
#     pgConn = destinationPgConnector()  
#     pgConn.execute_and_commit(
#       "INSERT INTO {0}(date, sourceidp, service, countrycode, country, count) VALUES ('{1}', '{2}', '{3}', '{4}', '{5}', {6}) ON CONFLICT (date, sourceidp, service, countrycode) DO UPDATE SET count = {0}.count + 1".format(countryStatistics.STATISTICSTABLE, countryStatistics.date, countryStatistics.sourceIdp, countryStatistics.service, countryStatistics.countrycode, countryStatistics.country, 1)
#     )
  
#   @classmethod
#   def saveAll(self, countryStatisticsList):
#     pgConn = destinationPgConnector()
#     values = ''
#     for item in countryStatisticsList:
#       values += "INSERT INTO {0}(date, sourceidp, service, countrycode, country, count) VALUES ('{1}', '{2}', '{3}', '{4}', '{5}', {6}) ON CONFLICT (date, sourceidp, service, countrycode) DO UPDATE SET count = {0}.count + 1;".format(countryStatistics.STATISTICSTABLE, item.date, item.sourceIdp, item.service, item.countrycode, item.country, 1)
#     pgConn.execute_and_commit(values)
