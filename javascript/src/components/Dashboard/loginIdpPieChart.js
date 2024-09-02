import React, {useState, useEffect} from "react";
import {Chart} from "react-google-charts";
import {useCookies} from "react-cookie";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import {useQuery} from "react-query";
import {loginsPerIdpKey} from "../../utils/queryKeys";
import {getLoginsPerIdp} from "../../utils/queries";
import {optionsPieChart} from "../../utils/helpers/enums";
import {convertDateByGroup, formatStartDate, formatEndDate} from "../Common/utils";


const LoginIdpPieChart = ({
                            spId,
                            tenenvId,
                            uniqueLogins,
                            goToSpecificProviderHandler
                          }) => {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  formatStartDate(oneYearAgo)

  const today = new Date();
  today.setDate(today.getDate() - 1);
  formatEndDate(today)
  
  let idpsChartArray = [["Identity Provider", "Logins"]];
  let idpsArray = [];
  const [idps, setIdps] = useState(idpsChartArray);
  const [idpsAr, setIdpsArray] = useState(idpsArray);
  const params = {
    params: {
      'tenenv_id': tenenvId,
      'unique_logins': uniqueLogins,
      'sp': spId,
    }
  }

  const [cookies, setCookie] = useCookies();
  const permissions = cookies.permissions

  const loginsPerIpd = useQuery(
    [loginsPerIdpKey, params],
    getLoginsPerIdp, {
      refetchOnWindowFocus: false,
      enabled: false
    }
  )

  useEffect(() => {
    loginsPerIpd.refetch()
      .then(response => {
        response?.data?.forEach(element => {
          idpsChartArray.push([element.name, element.count])
          idpsArray.push([element.id, element.name, element.identifier])
        })
        setIdps(idpsChartArray)
        setIdpsArray(idpsArray)
      })

  }, [uniqueLogins])

  // XXX Google Chart will not work if we return empty and then
  //     try to reload
  // if (loginsPerIpd.isLoading
  //   || loginsPerIpd.isFetching
  //   || idps.length <= 1
  // ) {
  //   return null
  // }

  return (
    <Row>
      <Col md={12} className="box">
        <div className="box-header with-border">
          <h3 className="box-title">Overall number of logins per IdP</h3>
        </div>
        <Chart
          chartType="PieChart"
          data={idps}
          options={optionsPieChart}
          loader={<div>Data loading</div>}
          width={"100%"}
          height={"400px"}
          className="pieChart"
          chartEvents={[
            {
              eventName: "ready",
              callback: ({chartWrapper, google}) => {
                const chart = chartWrapper.getChart();

                
                  google.visualization.events.addListener(chart, 'click', selectHandler);
                

                google.visualization.events.addListener(chart, 'onmouseover', showTooltip);
                google.visualization.events.addListener(chart, 'onmouseout', hideTooltip);

                function showTooltip(entry) {

                  chart.setSelection([{row: entry.row}]);
                  $('.pieChart').css('cursor', 'pointer')
                }

                function hideTooltip() {

                  chart.setSelection([]);
                  $('.pieChart').css('cursor', 'default')
                }

                function selectHandler() {

                  var selection = chart.getSelection();              
                  if (selection.length) {
                    var identifier = idpsAr[selection[0].row];       
                    goToSpecificProviderHandler(identifier[0])
                  }
                }
              }
            }
          ]}
        /></Col>
    </Row>
  );
}

export default LoginIdpPieChart