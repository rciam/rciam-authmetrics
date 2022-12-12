import {useState, useContext, useEffect} from "react";
import "../../app.css";
import {client} from '../../utils/api';
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import Datatable from "../datatable";
import dateFormat from 'dateformat';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import Dropdown from 'react-dropdown';
import { ToastContainer, toast } from 'react-toastify';
import { convertDateByGroup, getWeekNumber } from "../Common/utils";
import 'react-toastify/dist/ReactToastify.css';
import 'react-dropdown/style.css';
import "react-datepicker/dist/react-datepicker.css";

const dropdownOptions = [
    
    { value: 'day', label: 'Daily Basis', className: 'myOptionClassName' },
    { value: 'week', label: 'Weekly Basis', className: 'myOptionClassName' },
    { value: 'month', label: 'Monthly Basis' },
    { value: 'year', label: 'Yearly Basis' },
]

const RegisteredUsersDataTable =() => {
    const [usersPerCountryPerPeriod, setusersPerCountryPerPeriod] = useState();
    var usersPerCountryPerPeriodArray = [];
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    useEffect(() => {
        client.get("registered_users_country_group_by/month").
        then(response => {
            console.log(response);
            response["data"].forEach(element => {     
                //var community = {"created":element.created, "name":element.community_info.name}
                
                var range_date = new Date(element.range_date);
                
                var perPeriod = { "Date": dateFormat(range_date, "yyyy-mm"), "Number of Registered Users": element.count, "Registered Users per country": element.countries}
                usersPerCountryPerPeriodArray.push(perPeriod)
                
            });
            setusersPerCountryPerPeriod(usersPerCountryPerPeriodArray)
          })
        // 
        
    }, [])
    
    const handleChange = event => {
        console.log(event.value);
        usersPerCountryPerPeriodArray = []
        if(!startDate || !endDate) {
            toast.error('You have to fill both startDate and endDate.', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
            return
        }
        client.get("registered_users_country_group_by/"+event.value, {params: {'startDate':startDate, 'endDate':endDate}}).
        then(response => {
            //console.log(response);
            response["data"].forEach(element => {     
                
                var range_date = new Date(element.range_date);
                
                var perPeriod = { "Date": convertDateByGroup(range_date, event.value), "Number of Registered Users": element.count, "Registered Users per country": element.countries}
                usersPerCountryPerPeriodArray.push(perPeriod)
                
            });
            // This is essential: We must destroy the datatable in order to be refreshed with the new data
            $("#table").DataTable().destroy()
            setusersPerCountryPerPeriod(usersPerCountryPerPeriodArray)
            
            
          })
        //setSelected(event.value);
    };

    return <Row>
            <Col lg={12} className="range_inputs">
                
                From: <DatePicker selected={startDate} onChange={(date:Date) => setStartDate(date)}></DatePicker>
                To: <DatePicker selected={endDate} onChange={(date:Date) => setEndDate(date)}></DatePicker>
                <Dropdown placeholder='Filter' options={dropdownOptions} onChange={handleChange}/>
                <ToastContainer position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark" />
            </Col>
            <Col lg={12}>
                <Datatable items={usersPerCountryPerPeriod} columnSep="Registered Users per country"></Datatable>
            </Col>
        </Row>


}

export default RegisteredUsersDataTable