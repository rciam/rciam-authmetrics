from datetime import date, timedelta
from Model.serviceProvidersMapFromProxy import serviceProvidersMapFromProxy
from Model.serviceProvidersMap import serviceProvidersMap
from datetime import datetime, timedelta
class serviceProvidersMapController:

  @classmethod
  def getAllData(self):

    result = serviceProvidersMapFromProxy.getAllSps()
    return result

    
