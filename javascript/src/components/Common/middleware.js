import React, {useEffect} from 'react'
import Communities from "../../Pages/Communities";
import Users from "../../Pages/Users";
import Dashboard from "../../Pages/Dashboard";
import Idps from "../../Pages/Idps";
import Sps from "../../Pages/Sps";
import Sp from "../../Pages/Sps/sp";
import Idp from "../../Pages/Idps/idp";
import Login from "../../Pages/Authentication/Login";
import ErrorPage from "../../Pages/Error";
import {useParams} from "react-router-dom";
import {useCookies} from "react-cookie";
import config from '../../config.json'

const Middleware = ({elementName}) => {
  const [cookies, setCookie] = useCookies();

  // We only want to set the Cookies once since we will cause an infinite
  // rerender in case we do not.
  useEffect(() => {
    // XXX We set the environment and tenant globally
    setCookie('x-tenant', config.tenant, {path: '/'});
    setCookie('x-environment', config.environment, {path: '/'});
  }, []);

  const Component = elementName
  return (
    <Component/>
  )
}

export default Middleware