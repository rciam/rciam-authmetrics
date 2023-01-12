from datetime import date, timedelta
from Model.identityProvidersMapFromProxy import identityProvidersMapFromProxy
from Model.identityProvidersMap import identityProvidersMap
from datetime import datetime, timedelta
class identityProvidersMapController:

  @classmethod
  def getAllData(self):

    result = identityProvidersMapFromProxy.getAllIdps()
    return result

    
