import { useState, useContext, useEffect } from "react";
import Container from "react-bootstrap/Container";
import RegisteredUsersChart from "../../components/Users/registeredUsersChart";
import RegisteredUsersDataTable from "../../components/Users/registeredUsersDataTable";
import RegisteredUsersMap from "../../components/Users/registeredUsersMap";
import RegisteredUsersTiles from "../../components/Users/registeredUsersTiles";


const Users = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    return (
    <Container>
        <h1>Users</h1>
        <RegisteredUsersTiles></RegisteredUsersTiles>
        <RegisteredUsersChart></RegisteredUsersChart>
        <RegisteredUsersDataTable startDateHandler={setStartDate} endDateHandler={setEndDate}></RegisteredUsersDataTable>
        <RegisteredUsersMap startDate={startDate} endDate={endDate}></RegisteredUsersMap>
        
    </Container>)

}
export default Users;
