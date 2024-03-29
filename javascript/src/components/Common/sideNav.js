import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import Sidebar from "react-bootstrap-sidebar-menu";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDoorOpen, faHome, faUser, faUsers, faWarehouse} from '@fortawesome/free-solid-svg-icons';
import {useCookies} from 'react-cookie';


const SideNav = ({
                   userInfo,
                   permissions
                 }) => {
  const [reload, setReload] = useState(false)
  const [cookies, setCookie] = useCookies();

  const tenant = cookies['x-tenant']
  const environment = cookies['x-environment']

  useEffect(() => {
    setReload((prev) => !prev)
  }, [userInfo, permissions])

  return (
    <Sidebar expand="sm">
      <Sidebar.Collapse>
        <Sidebar.Header>
          <Sidebar.Toggle/>
        </Sidebar.Header>
        <Sidebar.Body>
          <Sidebar.Nav>
            {/* Home */}
            <Link className="sidebar-menu-nav-link"
                  to={"/metrics"}>
              <Sidebar.Nav.Icon><FontAwesomeIcon icon={faHome}/></Sidebar.Nav.Icon>
              <Sidebar.Nav.Title>Home</Sidebar.Nav.Title>
            </Link>
            {/* Identity Providers */}
            <Link className="sidebar-menu-nav-link"
                  to={"/metrics/identity-providers"}>
              <Sidebar.Nav.Icon><FontAwesomeIcon icon={faWarehouse}/></Sidebar.Nav.Icon>
              <Sidebar.Nav.Title>Identity Providers</Sidebar.Nav.Title>
            </Link>
            {/* Services */}
            <Link className="sidebar-menu-nav-link"
                  to={"/metrics/services"}>
              <Sidebar.Nav.Icon><FontAwesomeIcon icon={faDoorOpen}/></Sidebar.Nav.Icon>
              <Sidebar.Nav.Title>Services</Sidebar.Nav.Title>
            </Link>
            {
              userInfo != undefined
              && !!permissions?.actions?.registered_users?.['view'] ?
                // Users
                (<Link className="sidebar-menu-nav-link"
                       to={"/metrics/users"}>
                  <Sidebar.Nav.Icon><FontAwesomeIcon icon={faUser}/></Sidebar.Nav.Icon>
                  <Sidebar.Nav.Title>Users</Sidebar.Nav.Title>
                </Link>) : null
            }
            {
              userInfo != undefined
              && !!permissions?.actions?.communities?.['view'] ?
                // Communities
                (<Link className="sidebar-menu-nav-link"
                       to={"/metrics/communities"}>
                  <Sidebar.Nav.Icon><FontAwesomeIcon icon={faUsers}/></Sidebar.Nav.Icon>
                  <Sidebar.Nav.Title>Communities</Sidebar.Nav.Title>
                </Link>) : null
            }
          </Sidebar.Nav>
        </Sidebar.Body>
      </Sidebar.Collapse>
    </Sidebar>
  )
}
export default SideNav