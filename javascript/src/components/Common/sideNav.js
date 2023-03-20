import React, { useContext } from 'react';
import { Navbar, Container } from "react-bootstrap";
import Nav from 'react-bootstrap/Nav';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
// import {userContext,tenantContext} from '../context.js';
import Sidebar from "react-bootstrap-sidebar-menu";
import Layout from './layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faObjectGroup, faShield, faUsers, faWarehouse } from '@fortawesome/free-solid-svg-icons';

const SideNav = (props) => {
    // eslint-disable-next-line
    //   const tenant = useContext(tenantContext);
    //   const user = useContext(userContext);
    // eslint-disable-next-line
    const { t, i18n } = useTranslation();

    return (
        
            <Sidebar expand="sm">
                <Sidebar.Collapse>
                    <Sidebar.Header>
                        {/* <Sidebar.Brand>Logo</Sidebar.Brand> */}
                        <Sidebar.Toggle />
                    </Sidebar.Header>
                    <Sidebar.Body>
                        <Sidebar.Nav>
                            
                            <Sidebar.Nav.Link href="/egi/devel">
                                <Sidebar.Nav.Icon><FontAwesomeIcon icon={faHome}/></Sidebar.Nav.Icon>
                                <Sidebar.Nav.Title>Home</Sidebar.Nav.Title>
                            </Sidebar.Nav.Link>
                            <Sidebar.Nav.Link href="/egi/devel/idps">
                                <Sidebar.Nav.Icon><FontAwesomeIcon icon={faWarehouse}/></Sidebar.Nav.Icon>
                                <Sidebar.Nav.Title>Idps</Sidebar.Nav.Title>
                            </Sidebar.Nav.Link>
                            <Sidebar.Nav.Link href="/egi/devel/users">
                                <Sidebar.Nav.Icon><FontAwesomeIcon icon={faUsers}/></Sidebar.Nav.Icon>
                                <Sidebar.Nav.Title>Users</Sidebar.Nav.Title>
                            </Sidebar.Nav.Link>
                            <Sidebar.Nav.Link href="/egi/devel/communities">
                                <Sidebar.Nav.Icon><FontAwesomeIcon icon={faObjectGroup}/></Sidebar.Nav.Icon>
                                <Sidebar.Nav.Title>Communities</Sidebar.Nav.Title>
                            </Sidebar.Nav.Link>
                            {/* <Sidebar.Sub eventKey={0}>
                                <Sidebar.Sub.Toggle>
                                    <Sidebar.Nav.Icon />
                                    <Sidebar.Nav.Title>Submenu</Sidebar.Nav.Title>
                                </Sidebar.Sub.Toggle>
                                <Sidebar.Sub.Collapse>
                                    <Sidebar.Nav>
                                        <Sidebar.Nav.Link eventKey="sum_menu_title">
                                            <Sidebar.Nav.Icon>1.1</Sidebar.Nav.Icon>
                                            <Sidebar.Nav.Title>Sub menu item</Sidebar.Nav.Title>
                                        </Sidebar.Nav.Link>
                                    </Sidebar.Nav>
                                </Sidebar.Sub.Collapse>
                            </Sidebar.Sub> */}
                        </Sidebar.Nav>
                    </Sidebar.Body>
                </Sidebar.Collapse>
            </Sidebar>
                )
}
export default SideNav