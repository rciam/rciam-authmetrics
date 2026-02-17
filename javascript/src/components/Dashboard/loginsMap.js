import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'jquery-mapael';
import 'jquery-mapael/js/maps/world_countries_mercator.js';
import {useQuery, useQueryClient} from "react-query";
import {loginsPerCountryKey, minDateLoginsKey} from "../../utils/queryKeys";
import {getLoginsPerCountry, getMinDateLogins} from "../../utils/queries";
import EarthMap from "../Common/earthMap";
import DateRange from "../Common/dateRange";
import Spinner from "../Common/spinner";
import React from "react";
import {formatStartDate, formatEndDate} from "../Common/utils";

const LoginsMap = ({
                     startDate,
                     endDate,
                     tenenvId,
                     uniqueLogins
                   }) => {

  let params = {
    params: {
      'startDate': !startDate ? null : formatStartDate(startDate),
      'endDate': !endDate ? null : formatEndDate(endDate),
      'tenenv_id': tenenvId,
      'unique_logins': uniqueLogins
    }
  }

  const loginsPerCountry = useQuery(
    [loginsPerCountryKey, params],
    getLoginsPerCountry,
    {
      // enabled: false, this caused problems rendering map
      refetchOnWindowFocus: false
    }
  )
  
  let paramsMinDate = {
    params: {
      'startDate': !startDate ? null : formatStartDate(startDate),
      'endDate': !endDate ? null : formatEndDate(endDate),
      'tenenv_id': tenenvId,
      'unique_logins': true
    }
  }

  const minDateLogins = useQuery(
    [minDateLoginsKey, paramsMinDate],
    getMinDateLogins,
    {
      enabled: false,
      refetchOnWindowFocus: false
    }
  )

  if (loginsPerCountry.isLoading
    || loginsPerCountry.isFetching) {
    return (<Spinner/>)
  }

  if(loginsPerCountry.length === 0) {
    return null
  }

  return (
    <Row className="loginsByCountry">
      <Col md={12} className="box">
        <div className="box-header with-border">
          <h3 className="box-title">
            <DateRange startDate={startDate} endDate={endDate} 
            minDate={!!minDateLogins?.data?.min_date ? new Date(minDateLogins?.data?.min_date) : null}
            maxDate={!!minDateLogins?.data?.max_date ? new Date(minDateLogins?.data?.max_date) : null}
            />
          </h3>
        </div>
        <EarthMap datasetQuery={loginsPerCountry}
                  tooltipLabel="Logins"
                  legendLabel="Logins per country"/>
      </Col>
    </Row>
  )
}

export default LoginsMap;