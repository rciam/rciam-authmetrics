import React, {useEffect} from "react";
import {useQuery, useQueryClient} from "react-query";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'jquery-mapael';
import 'jquery-mapael/js/maps/world_countries_mercator.js';
import {getRegisteredUsersByCountry} from "../../utils/queries";
import {registeredUsersByCountryKey} from "../../utils/queryKeys";
import EarthMap from "../Common/earthMap";
import Spinner from "../Common/spinner";
import {formatStartDate, formatEndDate} from "../Common/utils";

const RegisteredUsersMap = ({
                              showActiveOnly,
                              startDate,
                              endDate,
                              tenenvId
                            }) => {
  const queryClient = useQueryClient()

  let params = {
    params: {
      'startDate': !startDate ? null : formatStartDate(startDate),
      'endDate': !endDate ? null : formatEndDate(endDate),
      'tenenv_id': tenenvId,
      'status': showActiveOnly ? 'A' : null,
    }
  }

  const registeredUsersByCountry = useQuery(
    [registeredUsersByCountryKey, params],
    getRegisteredUsersByCountry,
    {
      enabled: false,
      refetchOnWindowFocus: false
    }
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await queryClient.refetchQueries([registeredUsersByCountryKey, params])
      } catch (error) {
        console.error(RegisteredUsersMap.name + " error: " + error)
      }
    }
    fetchData();
  }, [startDate, endDate, tenenvId, showActiveOnly])

  if (registeredUsersByCountry.isLoading
    || registeredUsersByCountry.isFetching
    || registeredUsersByCountry.isRefetching) {
    return (<Spinner/>)
  }

  if (registeredUsersByCountry.isIdle) {
    return null
  }

  return (
    <Row className="box usersByCountry">
      <Col lg={12}>
        <div className="box-header with-border">
          <h3 className="box-title">Users Per Country</h3>
        </div>
      </Col>

      <Col lg={12}>
        <EarthMap datasetQuery={registeredUsersByCountry}
                  tooltipLabel="Users"
                  legendLabel="Users per country"/>
      </Col>

    </Row>
  )
}

export default RegisteredUsersMap;