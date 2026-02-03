import React, {useState, useEffect, useRef} from "react";
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import Datatable from "../datatable";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import Dropdown from 'react-dropdown';
import {toast} from 'react-toastify';
import {dropdownOptions} from "../../utils/helpers/enums";
import 'react-toastify/dist/ReactToastify.css';
import 'react-dropdown/style.css';
import "react-datepicker/dist/react-datepicker.css";
import {useQuery, useQueryClient} from "react-query";
import {loginsPerIdpKey, minDateRegisteredUsersKey, registeredUsersPerCountryGroupByKey} from "../../utils/queryKeys";
import {getMinDateRegisteredUsers, getRegisteredUsersPerCountryGroupBy} from "../../utils/queries";
import {useCookies} from "react-cookie";
import Spinner from "../Common/spinner";
import {convertDateByGroup, formatStartDate, formatEndDate, parseDateFromISO} from "../Common/utils";

const RegisteredUsersDataTable = ({
                                    tenenvId,
                                    setStartDate,
                                    setEndDate,
                                    startDate,
                                    endDate,
                                    showActiveOnly
                                  }) => {
  const dropdownRef = useRef(null);
  const [cookies, setCookie] = useCookies();
  const [usersPerCountryPerPeriod, setUsersPerCountryPerPeriod] = useState([]);
  const [dropdownOptionsState, setDropdownOptions] = useState([
    {value: '', label: 'None'},
    ...dropdownOptions
  ]);
  const [minDate, setMinDate] = useState("");
  const [groupBy, setGroupBy] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [dataTableReady, setDataTableReady] = useState(true);
  const queryClient = useQueryClient();


  let params = {
    params: {
      'startDate': !startDate ? null : formatStartDate(startDate),
      'endDate': !endDate ? null : formatEndDate(endDate),
      'tenenv_id': tenenvId,
      'status': showActiveOnly ? 'A' : null
    }
  }

  const registeredUsersPerCountryGroup = useQuery(
    [registeredUsersPerCountryGroupByKey, {groupBy: groupBy, params: params}],
    getRegisteredUsersPerCountryGroupBy,
    {
      /*enabled: false, this caused problems of fetching data*/ 
      refetchOnWindowFocus: false
    }
  )

  const minDateRegisteredUsers = useQuery(
    [minDateRegisteredUsersKey, params],
    getMinDateRegisteredUsers,
    {
      enabled: false,
      refetchOnWindowFocus: false
    }
  )


  useEffect(() => {
    const fetchData = async () => {
      params = {
        params: {
          'startDate': !startDate ? null : formatStartDate(startDate),
          'endDate': !endDate ? null : formatEndDate(endDate),
          'tenenv_id': tenenvId,
          'groupBy': groupBy,
          'status': showActiveOnly ? 'A' : null
        }
      }

      try {
        setIsLoading(true);
        setDataTableReady(false);
        const response = await queryClient.refetchQueries([registeredUsersPerCountryGroupByKey, {
          groupBy: groupBy,
          params: params
        }])
        await queryClient.refetchQueries([minDateRegisteredUsersKey, {params:{tenenv_id: tenenvId}}])
      } catch (error) {
        setIsLoading(false);
        setDataTableReady(true);
        // todo: Here we can handle any authentication or authorization errors
        console.log(RegisteredUsersDataTable.name + " error: " + error)
      }
    }
    fetchData();
  }, [groupBy, showActiveOnly, startDate, endDate])

  // Construct the data required for the datatable
  useEffect(() => {
    const perPeriod = registeredUsersPerCountryGroup?.data?.map(user => ({
        "Date": !!user?.range_date ? (groupBy ? convertDateByGroup(parseDateFromISO(user?.range_date), groupBy) : user?.range_date) : null,
        "Number of Registered Users": user?.count,
        "Registered Users per country": user?.countries
      }))

    if (!!registeredUsersPerCountryGroup?.data && !!perPeriod) {
      // This is essential: We must destroy the datatable in order to be refreshed with the new data
      const table = $("#table-users");
      if (table.length && table.DataTable() && typeof table.DataTable().destroy === 'function') {
        table.DataTable().destroy()
      }
      setUsersPerCountryPerPeriod(perPeriod)
      
      // Wait for DataTable to be fully initialized before enabling inputs
      setTimeout(() => {
        setIsLoading(false);
        setDataTableReady(true);
      }, 1000); // 2 second disabled state
    }
  }, [registeredUsersPerCountryGroup.isSuccess && minDateRegisteredUsers.isSuccess, groupBy, startDate, endDate])


  const handleStartDateChange = (date) => {
    if(isLoading) return;
    if(date != null) {
      setStartDate(date);
    }
    
  };

  const handleEndDateChange = (date) => {
    if(isLoading) return;
    if(date != null) {
      setEndDate(date);
    }
    
  };

  const handleChange = (event) => {
    if(isLoading) return;
    if (!startDate || !endDate) {
      toast.warning("You have to fill both startDate and endDate")
      return
    }
    setGroupBy(event.value)
  };

  return (
    <Row className="box">
      <Col md={12}>
        <div className="box-header with-border">
          <h3 className="box-title">Registered Users per country</h3>
        </div>
      </Col>
      <Col lg={12} className="range_inputs">
        <div className="d-flex align-items-center flex-wrap gap-2" style={isLoading ? {pointerEvents: 'none', opacity: 0.6} : {}}>
          <div className="d-flex align-items-center">
            <span className="me-2">From:</span>
            <DatePicker selected={startDate}
                              minDate={minDate}
                              dateFormat="dd/MM/yyyy"
                              onChange={handleStartDateChange}
                              disabled={isLoading}
                              readOnly={isLoading}/>
          </div>
          <div className="d-flex align-items-center">
            <span className="me-2">To:</span>
            <DatePicker selected={endDate}
                            minDate={minDate}
                            dateFormat="dd/MM/yyyy"
                            onChange={handleEndDateChange}
                            disabled={isLoading}
                            readOnly={isLoading}/>
          </div>
          <div style={{minWidth: '150px', maxWidth: '200px'}}>
            <Dropdown placeholder='None'
                       options={dropdownOptionsState}
                       onChange={handleChange}
                       ref={dropdownRef}
                       disabled={isLoading}
                       className={isLoading ? 'dropdown-disabled' : ''}/>
          </div>
        </div>
      </Col>
      <Col lg={12}>
        {      
            <Datatable dataTableId="table-users"
                       items={usersPerCountryPerPeriod}
                       columnSep="Registered Users per country"/>        
        }
      </Col>
    </Row>
  )
}

export default RegisteredUsersDataTable