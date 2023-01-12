from ast import Or
from datetime import date, timedelta
from Model.users import users
from Model.usersFromComanage import usersFromComanage
from Model.vos import vos
from datetime import datetime, timedelta
from Logger import log

class usersController:
  logger = log.get_logger("usersController")

  @classmethod
  def saveUsers(self):
   
    usersList = []
    # get memberships with active status
    usersComanage = usersFromComanage.getAllUsers()
    # save memberships with active status
    for item in usersComanage:
        usersItem = users(item.hasheduserid, item.created, item.status)
        usersList.append(usersItem)
    # save data to tables if any
    if usersList:
      users.saveAll(usersList)


    
