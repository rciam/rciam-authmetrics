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
import {convertDateByGroup, formatStartDate, formatEndDate} from "../Common/utils";

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
        const response = await queryClient.refetchQueries([registeredUsersPerCountryGroupByKey, {
          groupBy: groupBy,
          params: params
        }])
        queryClient.refetchQueries([minDateRegisteredUsersKey, {params:{tenenv_id: tenenvId}}])
      } catch (error) {
        // todo: Here we can handle any authentication or authorization errors
        console.log(RegisteredUsersDataTable.name + " error: " + error)
      }
    }
    fetchData();
  }, [groupBy, showActiveOnly, startDate, endDate])

  // Construct the data required for the datatable
  useEffect(() => {
    const perPeriod = registeredUsersPerCountryGroup?.data?.map(user => ({
        "Date": !!user?.range_date ? (groupBy ? convertDateByGroup(new Date(user?.range_date), groupBy) : user?.range_date) : null,
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
    }
  }, [registeredUsersPerCountryGroup.isSuccess && minDateRegisteredUsers.isSuccess, groupBy, startDate, endDate])


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
  };

  return (
    <Row className="box">
      <Col md={12}>
        <div className="box-header with-border">
          <h3 className="box-title">Registered Users per country</h3>
        </div>
      </Col>
      <Col lg={12} className="range_inputs">
        From: <DatePicker selected={startDate}
                          minDate={minDate}
                          dateFormat="dd/MM/yyyy"
                          onChange={handleStartDateChange}/>
        To: <DatePicker selected={endDate}
                        minDate={minDate}
                        dateFormat="dd/MM/yyyy"
                        onChange={handleEndDateChange}/>
        <Dropdown placeholder='None'
                   options={dropdownOptionsState}
                   onChange={handleChange}
                   ref={dropdownRef}/>
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