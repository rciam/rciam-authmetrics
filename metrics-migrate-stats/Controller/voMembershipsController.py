from ast import Or
from datetime import date, timedelta
from Model.voMemberships import voMemberships
from Model.voMembershipsFromComanage import voMembershipsFromComanage
from Model.vos import vos
from datetime import datetime, timedelta
from Logger import log

class voMembershipsController:
  logger = log.get_logger("voMembershipsController")
  
  @classmethod
  def getVoId(self, voName, source, tenenv_id):
    result = vos.getVoIdFromVoName(voName, source, tenenv_id)
    return result

  @classmethod
  def getDataNotMapped(self, tenenv_id):
    voMemberships.truncate(tenenv_id)

    voMembershipsList = []
    # dateFrom = vos.getLastDate()
    
    # we dont have any vos saved
    # if dateFrom[0][0] == None:

    # get memberships with active status
    activeMemberships = voMembershipsFromComanage.getAllVoMembershipsByStatus('A')
    # save memberships with active status
    for item in activeMemberships:
      result = voMembershipsController.getVoId(item.voName, "registry", tenenv_id)
      
      if len(result) > 0:
        voId = result[0][0]
        self.logger.info("Vo name {0} with id {1}".format(item.voName, result[0][0]))
        
        voMembershipsItem = voMemberships(voId, item.hasheduserid, item.status, item.created, tenenv_id)
        voMembershipsList.append(voMembershipsItem)
    # save data to tables if any
    if voMembershipsList:
      
      voMemberships.saveAll(voMembershipsList)
    
    # get memberships with grace period
    # save only if there isnt any existing membership or status membership is not Active/ Grace Period
    gracePeriodVoMembershipsList = []
    graceperiodMemberships = voMembershipsFromComanage.getAllVoMembershipsByStatus('GP')
    for item in graceperiodMemberships:
      result = voMembershipsController.getVoId(item.voName, "registry", tenenv_id)
      if len(result) > 0:
        voId = result[0][0]
        self.logger.info("Vo name {0} with id {1}".format(item.voName, result[0][0]))
        #check if already there is a membership with active status saved
        statusMembership = voMemberships.getMembershipStatus(voId, item.hasheduserid, tenenv_id)
        if len(statusMembership) > 0  and (statusMembership[0][0]=='A' or statusMembership[0][0]=='GP'):
            continue
        voMembershipsItem = voMemberships(voId, item.hasheduserid, item.status, item.created, tenenv_id)
        gracePeriodVoMembershipsList.append(voMembershipsItem)
    if len(gracePeriodVoMembershipsList)>0:
        voMemberships.saveAll(gracePeriodVoMembershipsList)

    # get memberships with other statuses
    # save only if there isnt any existing membership
    otherStatusVoMembershipsList = []
    otherStatusMemberships = voMembershipsFromComanage.getAllVoMembershipsByStatus('Other')
    for item in otherStatusMemberships:
      result = voMembershipsController.getVoId(item.voName, "registry", tenenv_id)
      if len(result) > 0:
        voId = result[0][0]
        self.logger.info("Vo name {0} with id {1}".format(item.voName, result[0][0]))
        #check if already there is a membership with active status saved
        statusMembership = voMemberships.getMembershipStatus(voId, item.hasheduserid, tenenv_id)
        if len(statusMembership) > 0:
          continue
        voMembershipsItem = voMemberships(voId, item.hasheduserid, item.status, item.created, tenenv_id)
        otherStatusVoMembershipsList.append(voMembershipsItem)
    if len(otherStatusVoMembershipsList)>0:
        voMemberships.saveAll(otherStatusVoMembershipsList)
    return result

    
