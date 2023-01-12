from datetime import date, timedelta
from Model.vosFromComanage import vosFromComanage
from Model.vos import vos
from datetime import datetime, timedelta
class vosController:
  @classmethod
  def getDataNotMapped(self):
    dateFrom = vos.getLastDate()
    
    # we dont have any vos saved
    if dateFrom[0][0] == None:
      result = vosFromComanage.getAllVos()
    else:
      dayAfter = dateFrom[0][0] + timedelta(days=1)
      dayFrom = dayAfter.strftime('%Y-%m-%d 00:00:00')
      
      yesterday = date.today() - timedelta(days=1)
      dateTo = yesterday.strftime('%Y-%m-%d 23:59:59')
      
      result = vosFromComanage.getVosByDate(dayFrom, dateTo)
    return result

    
