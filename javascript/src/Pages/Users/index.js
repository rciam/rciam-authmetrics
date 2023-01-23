import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from '../../utils/api';
import Container from "react-bootstrap/Container";
import RegisteredUsersChart from "../../components/Users/registeredUsersChart";
import RegisteredUsersDataTable from "../../components/Users/registeredUsersDataTable";
import RegisteredUsersMap from "../../components/Users/registeredUsersMap";
import RegisteredUsersTiles from "../../components/Users/registeredUsersTiles";


const Users = () => {
    const {project, environment } = useParams();
    const [tenantId, setTenantId] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {   
        client.get("tenant/" + project + "/" + environment).
            then(response => {         
                setTenantId(response["data"][0]["id"])
            })    
    }, [])

    if (tenantId == 0) return
    else return (
    <Container>
        <h1>Users</h1>
        <RegisteredUsersTiles tenantId={tenantId}></RegisteredUsersTiles>
        <RegisteredUsersChart tenantId={tenantId}></RegisteredUsersChart>
        <RegisteredUsersDataTable tenantId={tenantId} startDateHandler={setStartDate} endDateHandler={setEndDate}></RegisteredUsersDataTable>
        <RegisteredUsersMap tenantId={tenantId} startDate={startDate} endDate={endDate}></RegisteredUsersMap>
        
    </Container>)

}
export default Users;
