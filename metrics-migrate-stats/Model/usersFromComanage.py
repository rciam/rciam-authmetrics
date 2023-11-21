from Model.pgConnector import sourcePgConnector
from Utils import configParser
from datetime import date, timedelta
import hashlib

class usersFromComanage(object):
  USERSCOMANAGETABLE = configParser.getConfig('source_tables')['users_comanage']
  def __init__(self, userid, created, status):
    
    self.hasheduserid = hashlib.md5(userid.encode()).hexdigest()
    self.created = created
    self.status = status
    

  @classmethod
  def getAllUsers(self):
    pgConn = sourcePgConnector()
    result = (list(pgConn.execute_select("""
      SELECT identifier, cm_co_people.created, cm_co_people.status
      FROM cm_co_people 
      JOIN cm_identifiers 
        ON cm_co_people.id = cm_identifiers.co_person_id 
          AND NOT cm_co_people.deleted 
            AND cm_co_people.co_person_id IS NULL
            AND type='epuid'
      WHERE NOT cm_identifiers.deleted AND identifier_id IS NULL
        AND co_id=2 AND login=true
    """)))
    data = []
    for row in result:
      usersData = usersFromComanage(row[0], row[1], row[2])
      data.append(usersData)
    return data


