# from Model.pgConnector import destinationPgConnector
# from Utils import configParser
# import hashlib

# class countryStatisticsHashedUserId(object):
#   STATISTICSHASHEDTABLE = configParser.getConfig('destination_tables')['country_hashed_table']

#   def __init__(self, id, date,  hashedUserId, sourceIdp, service, countryCode, country,count):
#     self.id = id
#     self.date = date
#     self.hashedUserId = hashedUserId
#     self.sourceIdp = sourceIdp
#     self.service = service
#     self.countrycode = countryCode
#     self.country = country
#     self.count = count

#   @classmethod
#   def getLastDate(self):
#     pgConn = destinationPgConnector()
#     result = pgConn.execute_select("SELECT max(date::date) FROM {0}".format(countryStatisticsHashedUserId.STATISTICSHASHEDTABLE))
#     return result

#   @classmethod
#   def save(self, countryStatisticsHashedUserId):
#     pgConn = destinationPgConnector()  
#     pgConn.execute_and_commit(
#       "INSERT INTO {0}(date, hasheduserid, sourceidp, service, countrycode, country, count) VALUES ('{1}', '{2}', '{3}', '{4}', '{5}', '{6}', {7}) ON CONFLICT (date, hasheduserid, sourceidp, service, countrycode) DO UPDATE SET count = {0}.count + 1".format(countryStatisticsHashedUserId.STATISTICSHASHEDTABLE, countryStatisticsHashedUserId.date, hashlib.md5(countryStatisticsHashedUserId.hashedUserId.encode()).hexdigest(), countryStatisticsHashedUserId.sourceIdp, countryStatisticsHashedUserId.service, countryStatisticsHashedUserId.countrycode, countryStatisticsHashedUserId.country, 1)
#     )
  
#   @classmethod
#   def saveAll(self, countryStatisticsList):
#     pgConn = destinationPgConnector()
#     values = ''
#     for item in countryStatisticsList:
#       values += "INSERT INTO {0}(date, hasheduserid, sourceidp, service, countrycode, country, count) VALUES ('{1}', '{2}', '{3}', '{4}', '{5}', '{6}', {7}) ON CONFLICT (date, hasheduserid, sourceidp, service, countrycode) DO UPDATE SET count = {0}.count + 1;".format(countryStatisticsHashedUserId.STATISTICSHASHEDTABLE, item.date, hashlib.md5(item.hashedUserId.encode()).hexdigest(), item.sourceIdp, item.service, item.countrycode, item.country, 1)
#     pgConn.execute_and_commit(values)
