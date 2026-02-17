import React, {useState, useContext, useEffect} from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import RegisteredUsersChart from "../../components/Users/registeredUsersChart";
import RegisteredUsersDataTable from "../../components/Users/registeredUsersDataTable";
import RegisteredUsersMap from "../../components/Users/registeredUsersMap";
import RegisteredUsersTiles from "../../components/Users/registeredUsersTiles";
import Header from "../../components/Common/header";
import Footer from "../../components/Common/footer";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {useQuery} from "react-query";
import {tenenvKey} from "../../utils/queryKeys";
import {getTenenv} from "../../utils/queries";
import {formatStartDate, formatEndDate} from "../../components/Common/utils";
import {useCookies} from "react-cookie";

const Users = () => {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  formatStartDate(oneYearAgo)

  const today = new Date();
  today.setDate(today.getDate() - 1);
  formatEndDate(today)
  const [tenenvId, setTenenvId] = useState(0);
  const [startDate, setStartDate] = useState(oneYearAgo);
  const [endDate, setEndDate] = useState(today);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [cookies, setCookie] = useCookies();

  const tenant = cookies['x-tenant']
  const environment = cookies['x-environment']


  const tenenv = useQuery(
    [tenenvKey, {tenantId: tenant, environment: environment}],
    getTenenv, {
      retry: 0,
    })

  useEffect(() => {
    setTenenvId(tenenv?.data?.[0]?.id)
  }, [!tenenv.isLoading
  && tenenv.isSuccess
  && !tenenv.isFetching])


  if (tenenvId == undefined || tenenvId == 0 || tenenvId == "") return

  return (
    <Container>
      <Header/>
      <Row>
        <Col className="title-container" md={12}>
          <Col md={6}><h2>Users</h2></Col>
          <Col md={6} className="active-users">
            <Form className="active-users-form">
              <Form.Check type="checkbox"
                          id="active-users"
                          label="Show Active Users Only"
                          checked={showActiveOnly}
                          onChange={(e) => setShowActiveOnly(e.target.checked)}
              />
            </Form>
          </Col>
        </Col>
      </Row>
      <RegisteredUsersTiles tenenvId={tenenvId} showActiveOnly={showActiveOnly}/>
      <RegisteredUsersChart tenenvId={tenenvId} showActiveOnly={showActiveOnly}/>
      <RegisteredUsersDataTable tenenvId={tenenvId}
                                setStartDate={setStartDate}
                                setEndDate={setEndDate}
                                startDate={startDate}
                                endDate={endDate}
                                showActiveOnly={showActiveOnly}/>
      <RegisteredUsersMap tenenvId={tenenvId}
                          startDate={startDate}
                          endDate={endDate}
                          showActiveOnly={showActiveOnly}/>
      <Footer/>
    </Container>)

}
export default Users;
