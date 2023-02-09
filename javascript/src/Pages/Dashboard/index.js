import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from '../../utils/api';
import Container from "react-bootstrap/Container";
// import LoginDataTable from "../../components/Dashboard/loginDataTable";
// import LoginIdpPieChart from "../../components/Dashboard/loginIdpPieChart";
import LoginLineChart from "../../components/Dashboard/loginLineChart";
// import LoginsMap from "../../components/Dashboard/loginsMap";
// import LoginSpPieChart from "../../components/Dashboard/loginSpPieChart";
import LoginTiles from "../../components/Dashboard/loginTiles";
import Header from "../../components/Common/header";
import Footer from "../../components/Common/footer";
// import IdpModal from "../Idps/idpModal";

const Dashboard = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const {project, environment } = useParams();
    const [tenantId, setTenantId] = useState(0);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {   
        client.get("tenant/" + project + "/" + environment).
            then(response => {
                
                setTenantId(response["data"][0]["id"])
            })    
    }, [])
    if(tenantId == 0)
        return
    else return (
    <Container>
        <Header></Header>
        <h2>Dashboard</h2>
        <LoginTiles tenantId={tenantId}></LoginTiles>
        <LoginLineChart tenantId={tenantId}></LoginLineChart>
        {/* <LoginIdpPieChart tenantId={tenantId} setShowModalHandler={setShowModal}></LoginIdpPieChart>
        <LoginSpPieChart tenantId={tenantId} setShowModalHandler={setShowModal}></LoginSpPieChart>
        <LoginDataTable startDateHandler={setStartDate} endDateHandler={setEndDate} tenantId={tenantId}></LoginDataTable>
        <LoginsMap startDate={startDate} endDate={endDate} tenantId={tenantId}></LoginsMap> */}

        {/* <IdpModal tenantId={tenantId} showModal={showModal} setShowModalHandler={setShowModal}></IdpModal> */}
        <Footer></Footer>
    </Container>)

}
export default Dashboard;
