import { useCallback, useRef, useEffect } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import $ from "jquery";
import { calculateLegends, setMapConfiguration, setLegend } from "../Common/utils";
import 'jquery-mapael';
import 'jquery-mapael/js/maps/world_countries_mercator.js';
import {useQuery, useQueryClient} from "react-query";
import {loginsPerCountryKey} from "../../utils/queryKeys";
import {getLoginsPerCountry} from "../../utils/queries";
import {createMap} from "../Common/utils";

const LoginsMap = ({ startDate, endDate, tenantId, uniqueLogins }) => {
  const areaLegendRef = useRef(null)
  const queryClient = useQueryClient();

  let params = {
    params: {
      'startDate': startDate,
      'endDate': endDate,
      'tenant_id': tenantId,
      'unique_logins': uniqueLogins
    }
  }

  const loginsPerCountry = useQuery(
    [loginsPerCountryKey, params],
    getLoginsPerCountry,
    {
      enabled: false
    }
  )

  useEffect(() => {
    params = {
      params: {
        'startDate': startDate,
        'endDate': endDate,
        'tenant_id': tenantId,
        'unique_logins': uniqueLogins
      }
    }
    try {
      var response = queryClient.refetchQueries([loginsPerCountryKey, params])
    } catch (error) {
      // todo: Here we can handle any authentication or authorization errors
      console.log(error)
    }

  }, [uniqueLogins, startDate, endDate])

  const loginsMapDrawRef = useCallback(node => {
    if (loginsPerCountry?.data !== undefined && node !== undefined) {
      createMap(node, areaLegendRef, loginsPerCountry?.data)
    }
  }, [!loginsPerCountry.isLoading && loginsPerCountry.isSuccess && loginsPerCountry?.data])

  if (loginsPerCountry.isLoading
    || loginsPerCountry.isFetching
    || loginsPerCountry.length === 0) {
    return null
  }

  return (
    <Row className="loginsByCountry">
      <Col md={12} className="box">
        <div className="box-header with-border">
          <h3 className="box-title">Logins Per Country</h3>
        </div>
        <div className="container_map"
             ref={loginsMapDrawRef}
             id="loginsMap">
          <div className="map"></div>
          <div ref={areaLegendRef}
               className="areaLegend"></div>
        </div>
      </Col>
    </Row>
  )
}

export default LoginsMap;