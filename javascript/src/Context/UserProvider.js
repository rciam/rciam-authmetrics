import * as React from 'react'
import {useState} from "react";
import {UserContext} from "./UserContext";


function UserProvider({children}) {
  const [currentUser, setCurrentUser] = useState({});

  return (
    <UserContext.Provider value={{currentUser, setCurrentUser}}>
      {children}
    </UserContext.Provider>

  )
}

export {
  UserProvider
}