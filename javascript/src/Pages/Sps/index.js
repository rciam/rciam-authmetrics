import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from '../../utils/api';
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import LoginSpPieChart from "../../components/Dashboard/loginSpPieChart";
import LoginTiles from "../../components/Dashboard/loginTiles";
import SpsDataTable from "../../components/Sps/spsDataTable";
import SpModal from "./spModal";

const Sps = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [uniqueLogins, setUniqueLogins] = useState(false);
    const { project, environment } = useParams();
    const [tenantId, setTenantId] = useState(0);
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        client.get("tenant/" + project + "/" + environment).
            then(response => {
                setTenantId(response["data"][0]["id"])
            })
    }, [])
    const handleChange = event => {
        setUniqueLogins(event.target.checked);
        console.log(uniqueLogins)
    }
    if (tenantId == 0)
        return
    else return (
        <Container>
            <Row>
                <Col md={6}><h2>Service Providers Logins</h2></Col>
                <Col md={6} className="unique-logins">
                    <Form className="unique-logins-form">
                        <Form.Check
                            type="checkbox"
                            id="unique-logins"
                            label="Unique Logins"
                            onChange={handleChange}
                        />
                    </Form>
                </Col>
            </Row>
            <LoginTiles tenantId={tenantId} uniqueLogins={uniqueLogins}></LoginTiles>
            <LoginSpPieChart tenantId={tenantId} uniqueLogins={uniqueLogins} setShowModalHandler={setShowModal}></LoginSpPieChart>
            <SpsDataTable tenantId={tenantId} uniqueLogins={uniqueLogins}></SpsDataTable>
            <SpModal tenantId={tenantId} showModal={showModal} setShowModalHandler={setShowModal}></SpModal>
        </Container>)

}
export default Sps;
