from abc import ABC, abstractmethod
from Model.ipStatistics import ipStatistics
from Utils import configParser
import geoip2.database

class ipDatabase(ABC):
  DBFILENAME = configParser.getConfig('database_file')['db_filename']
  @abstractmethod
  def getCountryFromIp(self): 
    pass

class geoip2Database(ipDatabase):
  @classmethod
  def getCountryFromIp(self, ip, ipVersion):
    gi = geoip2.database.Reader('./databases/{0}'.format(ipDatabase.DBFILENAME))
    return [gi.country(ip).country.iso_code,gi.country(ip).country.name]


