import React, {useState, useEffect} from "react";
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import Datatable from "../datatable";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import DatePicker from "react-datepicker";
import 'react-toastify/dist/ReactToastify.css';
import 'react-dropdown/style.css';
import "react-datepicker/dist/react-datepicker.css";
import {useQuery, useQueryClient} from "react-query";
import {loginsPerIdpKey, minDateLoginsKey} from "../../utils/queryKeys";
import {getLoginsPerIdp, getMinDateLogins} from "../../utils/queries";
import {useCookies} from "react-cookie";
import {createAnchorElement, formatStartDate, formatEndDate} from "../Common/utils";
import {toast} from "react-toastify";
import Spinner from "../Common/spinner";
import {format} from "date-fns";

const IdpsDataTable = ({
                         spId,
                         dataTableId = "table-idp",
                         tenenvId,
                         uniqueLogins,
                         setStartDate,
                         setEndDate,
                         startDate,
                         endDate
                       }) => {
  const [cookies, setCookie] = useCookies();
  const permissions = cookies.permissions
  const tenant = cookies['x-tenant']
  const environment = cookies['x-environment']

  const [idpsLogins, setIdpsLogins] = useState([]);
  const [minDate, setMinDate] = useState("");
  const [btnPressed, setBtnPressed] = useState(false);
  const queryClient = useQueryClient();

  let params = {
    params: {
      'startDate': !startDate ? null : format(startDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      'endDate': !endDate ? null : format(endDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      'sp': spId,
      'tenenv_id': tenenvId,
      'unique_logins': uniqueLogins
    },
  }

  const loginsPerIpd = useQuery(
    [loginsPerIdpKey, params],
    getLoginsPerIdp,
    {
      enabled: false,
      refetchOnWindowFocus: false
    }
  )

  const minDateLogins = useQuery(
    [minDateLoginsKey, params],
    getMinDateLogins,
    {
      enabled: false,
      refetchOnWindowFocus: false
    }
  )

  useEffect(() => {
    params = {
      params: {
        'startDate': !startDate ? null : format(startDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        'endDate': !endDate ? null : format(endDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        'sp': spId,
        'tenenv_id': tenenvId,
        'unique_logins': uniqueLogins
      },
    }

    try {
      const response = queryClient.refetchQueries([loginsPerIdpKey, params])
      queryClient.refetchQueries([minDateLoginsKey, {params:{tenenv_id: tenenvId}}])
    } catch (error) {
      // todo: Here we can handle any authentication or authorization errors
      console.error(IdpsDataTable.name + " error: " + error)
    }

  }, [uniqueLogins, btnPressed])

  // Construct the data required for the datatable
  useEffect(() => {
    const perIdp = !loginsPerIpd.isLoading
      && !loginsPerIpd.isFetching
      && loginsPerIpd.isFetched
      && loginsPerIpd.isSuccess
      && loginsPerIpd?.data?.map(idp => ({
        "Identity Provider Name": (cookies.userinfo == undefined && !!permissions?.actions?.identity_providers?.['view']) ? idp.name : createAnchorElement(idp.name != '' ? idp.name : idp.entityid, `/metrics/identity-providers/${idp.id}`),
        "Identity Provider Identifier": idp.entityid,
        "Number of Logins": idp.count
      }))

    if (!!loginsPerIpd?.data && !!perIdp) {
      // This is essential: We must destroy the datatable in order to be refreshed with the new data
      if (minDate == undefined || minDate == "") {
        setMinDate(!!minDateLogins?.data?.min_date ? new Date(minDateLogins?.data?.min_date) : null)
      }
      $("#" + dataTableId).DataTable().destroy()
      setIdpsLogins(perIdp)
    }
  }, [uniqueLogins, loginsPerIpd.isSuccess && minDateLogins.isSuccess])

  const handleStartDateChange = (date) => {

    date = formatStartDate(date);
    if (date != null) {
      setStartDate(date);
    }
  };

  const handleEndDateChange = (date) => {

    //date = formatEndDate(date);
    if (date != null) {
      setEndDate(date);
    }
  };


  const handleBtnclick = () => {
    if (!startDate || !endDate) {
      toast.warning("You have to fill both startDate and endDate")
      return
    }
    setBtnPressed((prev) => !prev)
  }

  if (loginsPerIpd.isLoading
    || loginsPerIpd.isFetching) {
    return (<Spinner/>)
  }

  return (
    <Row className="box">
      <Col md={12}>
        <div className="box-header with-border">
          <h3 className="box-title">Number of logins</h3>
        </div>
      </Col>
      <Col lg={12} className="range_inputs">
        From: <DatePicker selected={startDate}
                          minDate={minDate}
                          dateFormat="dd/MM/yyyy"
                          onChange={handleStartDateChange}
      />
        To: <DatePicker selected={endDate}
                        minDate={minDate}
                        dateFormat="dd/MM/yyyy"
                        onChange={handleEndDateChange}
      />
        {/* Probably add a tooltip here that both fields are required */}
        <Button variant="light"
                disabled={startDate == undefined || endDate == undefined}
                onClick={handleBtnclick}>
          Filter
        </Button>
      </Col>
      <Col lg={12}>
        <Datatable items={idpsLogins}
                   dataTableId={dataTableId}/>
      </Col>
    </Row>
  )

}

export default IdpsDataTable