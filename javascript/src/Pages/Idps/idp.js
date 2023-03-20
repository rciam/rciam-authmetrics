import { useState, useContext, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import LoginLineChart from "../../components/Dashboard/loginLineChart";
import LoginSpPieChart from "../../components/Dashboard/loginSpPieChart";
import LoginTiles from "../../components/Dashboard/loginTiles";
import SpsDataTable from "../../components/Sps/spsDataTable";
import Form from 'react-bootstrap/Form';
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useParams } from "react-router-dom";
import { client } from '../../utils/api';
import EntityInfo from "../../components/Common/entityInfo";
import IdpMap from "../../components/Idps/idpMap";
import IdpMapToDataTable from "../../components/Idps/idpMapToDataTable";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const Idp = () => {
	const { project, environment, id } = useParams();
	const [tenantId, setTenantId] = useState(0);
	const [uniqueLogins, setUniqueLogins] = useState(false);

	//const [identifier, setIdentifier] = useState("");
	useEffect(() => {
		console.log(id + "-----")
		client.get("tenant/" + project + "/" + environment).
			then(response => {
				setTenantId(response["data"][0]["id"])
				console.log(tenantId)

			})

	}, [])
	const handleChange = event => {
		setUniqueLogins(event.target.checked);
		console.log(uniqueLogins)
	}
	if (tenantId == 0) return;
	else
		return (
			<Container>
				<Row>
					<Col md={6}><EntityInfo tenantId={tenantId} idpId={id}></EntityInfo></Col>
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
				<LoginTiles tenantId={tenantId} uniqueLogins={uniqueLogins} idpId={id}></LoginTiles>
				<LoginLineChart tenantId={tenantId} type="idp" id={id} uniqueLogins={uniqueLogins}></LoginLineChart>
				{/* <LoginSpPieChart tenantId={tenantId} idpId={id} uniqueLogins={uniqueLogins}></LoginSpPieChart>
				<SpsDataTable tenantId={tenantId} idpId={id} dataTableId="tableSps" uniqueLogins={uniqueLogins}></SpsDataTable>
				<Tabs>
					<TabList>
						<Tab>Map</Tab>
						<Tab>Datatable</Tab>
					</TabList>

					<TabPanel>
						<IdpMap tenantId={tenantId} idpId={id} uniqueLogins={uniqueLogins}></IdpMap>
					</TabPanel>
					<TabPanel>
						<IdpMapToDataTable tenantId={tenantId} idpId={id} uniqueLogins={uniqueLogins}></IdpMapToDataTable>
					</TabPanel>
				</Tabs>
				 */}
				
			</Container>
		)
}

export default Idp