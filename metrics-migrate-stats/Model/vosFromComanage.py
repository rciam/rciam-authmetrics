from Model.pgConnector import sourcePgConnector
from Utils import configParser
from datetime import date, timedelta

class vosFromComanage(object):
  VOSCOMANAGETABLE = configParser.getConfig('source_tables')['vos_comanage']
  def __init__(self, created, name, description, status):
    self.name = name
    self.description = description
    self.created = created
    self.status = status
  
  @classmethod
  def getVosByDate(self, dateFrom, dateTo):
    pgConn = sourcePgConnector()
    if(dateFrom != None):
      result = list(pgConn.execute_select("SELECT created::date, name, description, 'A' FROM {0} WHERE NOT deleted AND parent_id IS NULL AND cou_id IS NULL AND created::date BETWEEN  '{1}' AND '{2}'".format(vosFromComanage.VOSCOMANAGETABLE, dateFrom, dateTo)))
      
    else:
      result = list(pgConn.execute_select("SELECT created::date, name, description, 'A' FROM {0} WHERE NOT deleted AND parent_id IS NULL AND cou_id IS NULL AND created::date <= '{1}'".format(vosFromComanage.VOSCOMANAGETABLE, dateTo)))
    data = []
    for row in result:
      vosData = vosFromComanage(row[0], row[1], row[2], row[3])
      data.append(vosData)
    return data

  @classmethod
  # getAllVos except those created today
  def getAllVos(self):
    yesterday = date.today() - timedelta(days=1)
    dateTo = yesterday.strftime('%Y-%m-%d 23:59:59')
    pgConn = sourcePgConnector()
    result = list(pgConn.execute_select("SELECT created::date, name, description, 'A' FROM {0} WHERE NOT deleted AND parent_id IS NULL AND cou_id IS NULL AND created::date <= '{1}'".format(vosFromComanage.VOSCOMANAGETABLE, dateTo)))
    data = []
    for row in result:
      vosData = vosFromComanage(row[0], row[1], row[2], row[3])
      data.append(vosData)
    return data


