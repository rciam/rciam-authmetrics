import { useCallback, useRef, useEffect } from "react";
import { createMap } from "../Common/utils";
import { useQuery, useQueryClient } from "react-query";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'jquery-mapael';
import 'jquery-mapael/js/maps/world_countries_mercator.js';
import { getRegisteredUsersByCountry } from "../../utils/queries";
import { registeredUsersByCountryKey } from "../../utils/queryKeys";

const RegisteredUsersMap = ({ startDate, endDate, tenantId }) => {
  const areaLegendRef = useRef(null)
  const queryClient = useQueryClient();

  let params = {
    params: {
      'startDate': startDate,
      'endDate': endDate,
      'tenant_id': tenantId,
    }
  }

  const registeredUsersByCountry = useQuery(
    [registeredUsersByCountryKey, params],
    getRegisteredUsersByCountry,
    {
      enabled: false
    }
  )

  useEffect(() => {
    try {
      var response = queryClient.refetchQueries([registeredUsersByCountryKey, params])
    } catch (error) {
      console.log(error)
    }
  }, [startDate, endDate, tenantId])

  const registeredUsersMapDrawRef = useCallback(node => {
    if (registeredUsersByCountry?.data !== undefined && node !== undefined) {
      createMap(node, areaLegendRef, registeredUsersByCountry?.data, "Users", "Users per country")
    }
  }, [!registeredUsersByCountry.isLoading && registeredUsersByCountry.isSuccess && registeredUsersByCountry?.data])

  return (
    <Row className="box usersByCountry">
      <Col lg={12}>
        <div className="box-header with-border">
          <h3 className="box-title">Users Per Country</h3>
        </div>
      </Col>

      <Col lg={12}>
        <div className="container_map" ref={registeredUsersMapDrawRef} id="usersMap">
          <div className="map"></div>
          <div ref={areaLegendRef} className="areaLegend"></div>
        </div>
      </Col>

    </Row>
  )
}

export default RegisteredUsersMap;