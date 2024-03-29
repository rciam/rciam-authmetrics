import React, {useContext} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import {userinfoContext} from '../../Context/context';
import {useTranslation} from 'react-i18next';
import Login from "../../Pages/Authentication/Login"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import config from '../../config.json'

const NavbarTop = (props) => {
  // eslint-disable-next-line
  const [userInfo, setUserInfo] = useContext(userinfoContext);
  // eslint-disable-next-line
  const {t, i18n} = useTranslation();

  if (!config || !config?.theme_color) {
    return null
  }

  const handleLogoutClick = () => {
    // Redirect to the logout endpoint
    window.location.href = config?.logout_url
  }

  return (
    <Navbar className={"navbar-fixed-top"}>
      <Navbar.Collapse className="justify-content-end">
        {
          userInfo != undefined ?
            <DropdownButton
              variant="link"
              className='drop-menu drop-container-header'
              title={
                <>
                  <span style={{color: config?.theme_color}}>
                    {userInfo ? userInfo.name : 'login'}
                    <span>{userInfo && ' (' + userInfo.email + ')'}</span>
                  </span>
                </>
              }
              id="dropdown-menu-align-left"
            >
              <Dropdown.Item as="button"
                             onClick={handleLogoutClick}>
                <Dropdown.ItemText>
                  {userInfo.voperson_id}<span className="ml-1">(voPerson)</span>
                </Dropdown.ItemText>
                <div className="px-3">
                  <span className="me-1">{t('logout')}</span>
                  <FontAwesomeIcon icon={faSignOutAlt}/>
                </div>
              </Dropdown.Item>
            </DropdownButton>
            : <Login/>
        }
      </Navbar.Collapse>
    </Navbar>
  )
}
export default NavbarTop
  