#!/usr/local/bin/python3
import os
import sys
from Controller.statisticsCountryHashedController import statisticsCountryHashedController
from Controller.usersController import usersController

# change working directory
os.chdir(os.path.dirname(os.path.abspath(sys.argv[0])))
from Model.vos import vos
from Model.vosInfo import vosInfo
from Model.voMemberships import voMemberships
from Model.identityProvidersMap import identityProvidersMap
from Model.serviceProvidersMap import serviceProvidersMap
from Model.tenenvs import tenenvs
from Model.tenants import tenants
from Model.environments import environments
from Controller.vosController import vosController
from Controller.voMembershipsController import voMembershipsController
from Controller.identityProvidersMapController import identityProvidersMapController
from Controller.serviceProvidersMapController import serviceProvidersMapController
from Utils import configParser
from Logger import log


class migrateData:
  logger = log.get_logger("migrateData")
  tenantName = configParser.getConfig('tenenv')['tenant']
  tenantDescription = configParser.getConfig('tenenv')['tenant_description']
  environmentName = configParser.getConfig('tenenv')['environment']
  environmentDescription = configParser.getConfig('tenenv')['environment_description']

  environments.save(environments(environmentName, environmentDescription))
  environmentId = environments.getEnvironmentByName(environmentName)[0][0]

  tenants.save(tenants(tenantName, tenantDescription))
  tenantId = tenants.getTenantByName(tenantName)[0][0]

  tenenvs.save(tenenvs(tenantName, tenantName, tenantId, environmentId))
  tenenvId = tenenvs.getTenenvByTenantIdAndEnvId(tenantId, environmentId)[0][0]

  @classmethod
  def voMembershipsMigrate(self): 
    voMembershipsData = voMembershipsController.getDataNotMapped(self.tenenvId)
    

  @classmethod
  def vosMigrate(self):

    vosData = vosController.getDataNotMapped(self.tenenvId)
    mappedItems = 0
    
    for item in vosData:
      voItem = vosInfo(item.name, item.description, item.status, "registry", self.tenenvId)
      id = vosInfo.save(voItem) 
      if id is not None:
        self.logger.info("{0} item".format(id))
        vosInfoItem = vos(id, item.created, self.tenenvId)
        vos.save(vosInfoItem)
        mappedItems +=1
      

    if mappedItems > 0:
      self.logger.info("{0} vos created".format(mappedItems))
    else:
      self.logger.info("No new data found")
      
  @classmethod
  def idpsMigrate(self):
        mappedItems = 0
        idpsData = identityProvidersMapController.getAllData()
        for item in idpsData:
            idpItem = identityProvidersMap(entityid=item.entityid, name=item.name, tenenv_id=self.tenenvId)
            identityProvidersMap.save(idpItem)
            mappedItems +=1

        self.logger.info("{0} Idps created".format(mappedItems))

  @classmethod
  def spsMigrate(self):
        mappedItems = 0
        spsData = serviceProvidersMapController.getAllData()
        for item in spsData:
            spItem = serviceProvidersMap(item.identifier, item.name.replace("'", "''"), self.tenenvId)
            serviceProvidersMap.save(spItem)
            mappedItems +=1

        self.logger.info("{0} Sps created".format(mappedItems))
  @classmethod
  def countryStatsMigrate(self):
      statisticsCountryHashedController.saveAllData(self.tenenvId)

  @classmethod
  def usersMigrate(self):
    usersController.saveUsers(self.tenenvId)

#run script
 
# migrateData.vosMigrate()
# migrateData.voMembershipsMigrate()
migrateData.idpsMigrate()
migrateData.spsMigrate()
migrateData.countryStatsMigrate()
# migrateData.usersMigrate()
    
