import React, {useState, useEffect, useRef} from "react";
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import Datatable from "../datatable";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import Dropdown from 'react-dropdown';
import 'react-toastify/dist/ReactToastify.css';
import 'react-dropdown/style.css';
import "react-datepicker/dist/react-datepicker.css";
import {dropdownOptions} from "../../../src/utils/helpers/enums"
import {useQuery, useQueryClient} from "react-query";
import {loginsPerCountryKey, minDateLoginsKey} from "../../utils/queryKeys";
import {getLoginsPerCountry, getMinDateLogins} from "../../utils/queries";
import {toast} from "react-toastify";
import {convertDateByGroup, formatStartDate, formatEndDate, formatStartDateWithTimezone, formatEndDateWithTimezone, parseDateFromISO} from "../Common/utils";

const LoginDataTable = ({
                          startDateHandler,
                          endDateHandler,
                          minDateHandler,
                          tenenvId,
                          uniqueLogins
                        }) => {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  formatStartDate(oneYearAgo)

  const today = new Date();
  today.setDate(today.getDate() - 1);
  formatEndDate(today)

  const dropdownRef = useRef(null);
  const [loginsPerCountryPerPeriod, setLoginsPerCountryPerPeriod] = useState([]);
  const [minDate, setMinDate] = useState(null);
  // By default we fetch by month
  const [groupBy, setGroupBy] = useState("month");
  const [endDate, setEndDate] = useState(today);
  const [startDate, setStartDate] = useState(oneYearAgo);
  const [dropdownOptionsState, setDropdownOptions] = useState(dropdownOptions);
  const queryClient = useQueryClient();


  let params = {
    params: {
      'group_by': groupBy,
      'startDate': !startDate ? null : formatStartDateWithTimezone(startDate),
      'endDate': !endDate ? null : formatEndDateWithTimezone(endDate),
      'tenenv_id': tenenvId,
      'unique_logins': uniqueLogins
    },
  }

  const loginsPerCountry = useQuery(
    [loginsPerCountryKey, params],
    getLoginsPerCountry,
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
        'group_by': groupBy,
        'startDate': !startDate ? null : formatStartDateWithTimezone(startDate),
        'endDate': !endDate ? null : formatEndDateWithTimezone(endDate),
        'tenenv_id': tenenvId,
        'unique_logins': uniqueLogins
      },
    }

    try {
      const response = queryClient.refetchQueries([loginsPerCountryKey, params])
      queryClient.refetchQueries([minDateLoginsKey, {params:{tenenv_id: tenenvId}}])
    } catch (error) {
      // todo: Here we can handle any authentication or authorization errors
      console.error(LoginDataTable.name + " error: " + error)
    }

  }, [uniqueLogins, groupBy])

  // Construct the data required for the datatable
  useEffect(() => {
    if(groupBy == "") {
      return;
    }
    const loginsPerCountryPerPeriodArray = !loginsPerCountry.isLoading
      && !loginsPerCountry.isFetching
      && loginsPerCountry.isSuccess
      && loginsPerCountry?.data?.map(element => ({
        "Date": !!element?.range_date ? convertDateByGroup(parseDateFromISO(element?.range_date), groupBy) : null,
        "Number of Logins": element?.count,
        "Number of Logins per Country": element?.countries
      }))

    if (!!loginsPerCountry?.data && !!loginsPerCountryPerPeriodArray) {
      // We only keep the first date because the backend returns the dataset sorted and we only care about the
      // min of the min dates.
      if (minDate == undefined || minDate == "") {
        setMinDate(!!minDateLogins?.data?.min_date ? new Date(minDateLogins?.data?.min_date) : null)
        minDateHandler(!!minDateLogins?.data?.min_date ? new Date(minDateLogins?.data?.min_date) : null)
      }
      const table = $("#table-login");
      if (table.length && table.DataTable() && typeof table.DataTable().destroy === 'function') {
        table.DataTable().destroy()
      }
      setLoginsPerCountryPerPeriod(loginsPerCountryPerPeriodArray)

    }
  }, [uniqueLogins, loginsPerCountry.isSuccess && minDateLogins.isSuccess, groupBy])

  const handleAddOption = () => {
    // Create a new option dynamically
    const newOption =  {value: '', label: 'Filter'};

    // Check if the new option already exists in the options array
    if (!dropdownOptionsState.some(option => option.value === newOption.value)) {
      // If it doesn't exist, add it to the options array
      setDropdownOptions([newOption, ...dropdownOptionsState]);
    } 
  };

  const handleStartDateChange = (date) => {
    if(groupBy!=''){
      handleAddOption()
    }
    if(date != null) {
      if(endDate!=date){
        setGroupBy("")
      }
      setStartDate(date);
      dropdownRef.current.state.selected.label = 'Filter';
    }
    
  };

  const handleEndDateChange = (date) => {
    if(groupBy!=''){
      handleAddOption()
    }

    //date = formatEndDate(date);

    if(date != null) {
      if(endDate!=date){
        setGroupBy("")  
      }
      setEndDate(date);
      dropdownRef.current.state.selected.label = 'Filter';
    }
    
  };

  const handleChange = (event) => {
    if (!startDate || !endDate) {
      toast.warning("You have to fill both startDate and endDate")
      return
    }
    setGroupBy(event.value)
    startDateHandler(startDate)
    endDateHandler(endDate)
  };

  return (
    <Row className="box">
      <Col md={12}>
        <div className="box-header with-border">
          <h3 className="box-title">Number of logins</h3>
        </div>
      </Col>
      <Col lg={12} className="range_inputs">
        From: <DatePicker selected={startDate}
                          minDate={minDate ?? null}
                          dateFormat="dd/MM/yyyy"
                          onChange={handleStartDateChange}/>
        To: <DatePicker selected={endDate}
                        minDate={minDate ?? null}
                        dateFormat="dd/MM/yyyy"
                        onChange={handleEndDateChange}/>
        <Dropdown placeholder='Filter'
                  options={dropdownOptionsState}
                  onChange={handleChange}
                  ref={dropdownRef}/>
      </Col>
      <Col lg={12}>
        <Datatable dataTableId="table-login"
                   items={loginsPerCountryPerPeriod}
                   columnSep="Number of Logins per Country"/>
      </Col>
    </Row>
  )
}

export default LoginDataTable