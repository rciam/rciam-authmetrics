from Model.pgConnector import destinationPgConnector


pgConn = destinationPgConnector()
# Create tables if not exist
pgConn.execute_and_commit(
    open("./config-templates/pgsql_tables.sql", "r").read())

# Check if country_statistics has data and country_statistics_hashed doesn't
# dateFrom = countryStatistics.getLastDate()
# dateFromHashed = countryStatisticsHashedUserId.getLastDate()

# if (dateFrom[0][0] != None and dateFromHashed[0][0] == None):
#   logger = log.get_logger("install")
#   ipDatabaseHandler = geoip2Database()
#   # We must put data at country statistics hashed table
#   ipData = ipStatistics.getIpStatisticsByDate(None, dateFrom[0][0])
#   mappedItems = 0
#   countryStatsHashedList = []
  
#   for item in ipData:
#     # get network address
#     ipaddr = ipaddress.ip_network(item.ip).network_address
#     # get country code/ name
#     countryData = ipDatabaseHandler.getCountryFromIp(str(ipaddr), item.ipVersion)

#     if(countryData[0] != None):
#       mappedItems +=1
#     else:
#       countryData[0] = 'UN'
#       countryData[1] = 'Unknown'
#       logger.warning("ip {0} not found at database".format(ipaddr))
#     countryStatisticsHashedItem = countryStatisticsHashedUserId(None, item.accessed, item.userid, item.sourceIdp, item.service, countryData[0], countryData[1], 1)
#     countryStatsHashedList.append(countryStatisticsHashedItem)
#   if countryStatsHashedList:
#     countryStatisticsHashedUserId.saveAll(countryStatsHashedList)
#     logger.info("{0} ips mapped to countries".format(mappedItems))
#   else:
#     logger.info("No new data found")
pgConn.close()
