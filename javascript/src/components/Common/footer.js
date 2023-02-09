import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import { faUser, faUserShield, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import parse from 'html-react-parser';
import config from "./../../config_react.json";

const Footer = (props) => {
    const { project, environment } = useParams();
    const getConfig = key => config[project + "_" + environment][key]
    return (
        <footer>
            <div className="container ssp-footer--container">
                <Row className="row justify-content-center">
                    <Col sm="2" className="ssp-footer__item">
                        <div className="dropup ssp-footer__item__lang">

                            <DropdownButton onSelect={(e) => { props.changeLanguage(e) }} className="ssp-btn btn ssp-btn__footer dropdown-toggle" id='dropdown-button-drop-up' key="up" title={<React.Fragment ><span className="caret"></span> {props.lang === 'en' ? 'English' : 'Greek'}</React.Fragment>} drop="up" variant="link">
                                <Dropdown.Item eventKey="en" >English</Dropdown.Item>
                                <Dropdown.Item eventKey="gr">Greek</Dropdown.Item>
                            </DropdownButton>
                        </div>
                    </Col>
                    <Col sm="3" className="ssp-footer__item">
                        <div className="footer-logo-container">
                            <a href="https://grnet.gr/">
                                <Image className="ssp-footer__item__logo" src="https://vanilla-ui.aai-dev.grnet.gr/proxy/module.php/themevanilla/resources/images/grnet_logo_en.svg" alt="GRNET" />
                            </a>
                            <div className="ssp-footer__item__copyright">
                                Copyright ©2023      </div>
                        </div>
                    </Col>
                    <Col sm="3" className="ssp-footer__item">
                        <div className="footer_link_container">
                            <div className="ssp-footer__item__powered">
                                <a href={"mailto: " + (getConfig("config") && getConfig("config")["contact"]) }>Contact us</a>
                            </div>
                            <div className="ssp-footer__item__powered">
                                <a href={'https://federation.rciam.grnet.gr/docs'}>Documentation</a>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <div className='copyright-funding-footer'>
                        {getConfig("config") && getConfig("config")["footer_description"] && parse(getConfig("config")["footer_description"])} | Powered by <a href="https://rciam.github.io/rciam-docs/" target="_blank" rel="noreferrer"> RCIAM</a>
                    </div>
                </Row>
            </div>
        </footer>

    )
}

export default Footer