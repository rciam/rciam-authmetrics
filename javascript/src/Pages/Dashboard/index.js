import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from '../../utils/api';
import Form from 'react-bootstrap/Form';
import Container from "react-bootstrap/Container";
// import LoginDataTable from "../../components/Dashboard/loginDataTable";
import LoginIdpPieChart from "../../components/Dashboard/loginIdpPieChart";
import LoginLineChart from "../../components/Dashboard/loginLineChart";
// import LoginsMap from "../../components/Dashboard/loginsMap";
import LoginSpPieChart from "../../components/Dashboard/loginSpPieChart";
import LoginTiles from "../../components/Dashboard/loginTiles";
import Header from "../../components/Common/header";
import Footer from "../../components/Common/footer";
import SideNav from "../../components/Common/sideNav";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Layout from "../../components/Common/layout";
import Main from "../../components/Common/main";
// import IdpModal from "../Idps/idpModal";

const Dashboard = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [uniqueLogins, setUniqueLogins] = useState(false);
    const [tenantId, setTenantId] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const { project, environment } = useParams();
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

        <>
            <Header></Header>
            
            <Row>
                <Col md={6}><h2>Dashboard</h2></Col>
                {/* <Col md={6} className="unique-logins">
                    <Form className="unique-logins-form">
                        <Form.Check
                            type="checkbox"
                            id="unique-logins"
                            label="Unique Logins"
                            onChange={handleChange}
                        />
                    </Form>
                </Col> */}
            </Row>
            <LoginTiles tenantId={tenantId} uniqueLogins={uniqueLogins}></LoginTiles>
            <LoginLineChart tenantId={tenantId}></LoginLineChart>
            <LoginIdpPieChart tenantId={tenantId} setShowModalHandler={setShowModal}></LoginIdpPieChart>
            <LoginSpPieChart tenantId={tenantId} setShowModalHandler={setShowModal}></LoginSpPieChart>
            {/*<LoginDataTable startDateHandler={setStartDate} endDateHandler={setEndDate} tenantId={tenantId}></LoginDataTable>
                <LoginsMap startDate={startDate} endDate={endDate} tenantId={tenantId}></LoginsMap> */}

            {/* <IdpModal tenantId={tenantId} showModal={showModal} setShowModalHandler={setShowModal}></IdpModal> */}

            <Footer></Footer>
        </>
    )

}
export default Dashboard;
