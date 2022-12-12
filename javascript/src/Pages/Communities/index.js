import Container from "react-bootstrap/Container";
import CommunitiesChart from "../../components/Communities/communitiesChart";
import CommunitiesDataTable from "../../components/Communities/communitiesDataTable";
import CommunitiesMap from "../../components/Communities/communitiesMap";

const Communities = () => {

    return (
    <Container>
        <h1>Communities</h1>
        <CommunitiesChart></CommunitiesChart>
        <CommunitiesDataTable></CommunitiesDataTable>
        <CommunitiesMap></CommunitiesMap>
    </Container>)

}
export default Communities;
