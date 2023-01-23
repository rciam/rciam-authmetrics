import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from '../../utils/api';
import Container from "react-bootstrap/Container";
import CommunitiesChart from "../../components/Communities/communitiesChart";
import CommunitiesDataTable from "../../components/Communities/communitiesDataTable";
import CommunitiesMap from "../../components/Communities/communitiesMap";

const Communities = () => {
    const {project, environment } = useParams();
    const [tenantId, setTenantId] = useState(0);

    useEffect(() => {   
        client.get("tenant/" + project + "/" + environment).
            then(response => {
                
                setTenantId(response["data"][0]["id"])
            })    
    }, [])

    if (tenantId == 0) return
    else return (
    <Container>
        <h1>Communities</h1>
        <CommunitiesChart tenantId={tenantId}></CommunitiesChart>
        <CommunitiesDataTable tenantId={tenantId}></CommunitiesDataTable>
        <CommunitiesMap tenantId={tenantId}></CommunitiesMap>
    </Container>)

}
export default Communities;
