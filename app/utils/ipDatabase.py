from abc import ABC, abstractmethod
from app.utils import configParser
import geoip2.database


class ipDatabase(ABC):
    DBFILENAME = configParser.getConfig('ip_database_file', 'config.global.py')['db_filename']

    @abstractmethod
    def getCountryFromIp(self):
        pass


class geoip2Database(ipDatabase):
    @classmethod
    def getCountryFromIp(self, ip):
        gi = geoip2.database.Reader("""./app/ip_databases/{0}"""
                                    .format(ipDatabase.DBFILENAME))
        return [gi.country(ip).country.iso_code, gi.country(ip).country.name]

