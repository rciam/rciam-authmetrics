from Model.pgConnector import sourcePgConnector
from Utils import configParser
from datetime import date, timedelta
import hashlib

class voMembershipsFromComanage(object):
  VOMEMBERSHIPSCOMANAGETABLE = configParser.getConfig('source_tables')['vo_memberships_comanage']
  def __init__(self, voName, userid, status):
    self.status = status
    self.hasheduserid = hashlib.md5(userid.encode()).hexdigest()
    self.voName = voName
    self.source = "egi"
  
#   @classmethod
#   def getVosByDate(self, dateFrom, dateTo):
#     pgConn = sourcePgConnector()
#     if(dateFrom != None):
#       result = list(pgConn.execute_select("SELECT created::date, name, description FROM {0} WHERE NOT deleted AND parent_id IS NULL AND cou_id IS NULL AND created::date BETWEEN  '{1}' AND '{2}'".format(vosFromComanage.VOSCOMANAGETABLE, dateFrom, dateTo)))
      
#     else:
#       result = list(pgConn.execute_select("SELECT created::date, name, description FROM {0} WHERE NOT deleted AND parent_id IS NULL AND cou_id IS NULL AND created::date <= '{1}'".format(vosFromComanage.VOSCOMANAGETABLE, dateTo)))
#     data = []
#     for row in result:
#       vosData = vosFromComanage(row[0], row[1], row[2])
#       data.append(vosData)
#     return data

  @classmethod
  # getAllVoMemberships
  def getAllVoMembershipsByStatus(self, status):
    yesterday = date.today() - timedelta(days=1)
    dateTo = yesterday.strftime('%Y-%m-%d 23:59:59')
    pgConn = sourcePgConnector()
    if status == 'Other':
        subquery = 'AND cm_co_person_roles.status!=\'A\' AND cm_co_person_roles.status!=\'GP\''
    else:
        subquery = 'AND cm_co_person_roles.status=\'{0}\''.format(status)
    result = list(pgConn.execute_select("""
    SELECT cm_cous.name, identifier, cm_co_person_roles.status
    FROM cm_co_person_roles 
    JOIN cm_identifiers 
        ON cm_co_person_roles.co_person_id = cm_identifiers.co_person_id 
            AND NOT cm_co_person_roles.deleted 
            AND cm_co_person_roles.co_person_role_id IS NULL
            AND type='epuid'
    JOIN cm_cous ON cm_cous.id=cm_co_person_roles.cou_id AND cm_cous.cou_id IS NULL
    WHERE NOT cm_co_person_roles.deleted 
        AND NOT cm_identifiers.deleted AND identifier_id IS NULL
        {0}
    """.format(subquery)))
    data = []
    for row in result:
      vosData = voMembershipsFromComanage(row[0], row[1], row[2])
      data.append(vosData)
    return data


