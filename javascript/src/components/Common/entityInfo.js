
import { useState, useContext, useEffect } from "react";
import { client } from '../../utils/api';
import Container from 'react-bootstrap/Container';
import Select from 'react-select';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { convertDateByGroup, getWeekNumber } from "../Common/utils";
import 'bootstrap/dist/css/bootstrap.min.css';

const EntityInfo = (parameters) => {
    const [idp, setIdp] = useState([])
    useEffect(() => {
        if (parameters['idpId']) {
            client.get("idps", { params: { 'tenant_id': parameters['tenantId'], 'idpId': parameters['idpId']} }).
                then(idp_response => {
                    setIdp(idp_response["data"][0])
                    console.log(idp_response)
                })
        }
    }, [])

    return (
        <h3>{idp.name} ({idp.entityid})</h3>
    )
}

export default EntityInfo