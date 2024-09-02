import React, {useState, useEffect} from "react";
import {Chart} from "react-google-charts";
import {useCookies} from "react-cookie";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import {loginsPerSpKey} from "../../utils/queryKeys";
import {getLoginsPerSP} from "../../utils/queries";
import {useQuery} from "react-query";
import {optionsPieChart} from "../../utils/helpers/enums";
import {convertDateByGroup, formatStartDate, formatEndDate} from "../Common/utils";


const LoginSpPieChart = ({
                           idpId,
                           tenenvId,
                           uniqueLogins,
                           goToSpecificProviderHandler
                         }) => {
  let spsChartArray = [["Service Provider", "Logins"]];
  let spsArray = [];
  const [sps, setSps] = useState(spsChartArray);
  const [spsAr, setSpsArray] = useState(spsArray);
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  formatStartDate(oneYearAgo)

  const today = new Date();
  today.setDate(today.getDate() - 1);
  formatEndDate(today)

  const params = {
    params:
      {
        tenenv_id: tenenvId,
        unique_logins: uniqueLogins,
        idp: idpId,
      }
  }

  const [cookies, setCookie] = useCookies();
  const permissions = cookies.permissions

  const loginsPerSp = useQuery(
    [loginsPerSpKey, params],
    getLoginsPerSP,
    {
      refetchOnWindowFocus: false,
      enabled: false
    }
  )

  useEffect(() => {
    loginsPerSp.refetch()
      .then(response => {
        response?.data?.forEach(element => {
          spsChartArray.push([element.name, element.count])
          spsArray.push([element.id, element.name, element.identifier])
        })
        setSps(spsChartArray)
        setSpsArray(spsArray)
      })
  }, [uniqueLogins])

  // XXX Google Chart will not work if we return empty and then
  //     try to reload
  // if (sps.length === 1
  //     && (loginsPerSp.isLoading
  //         || loginsPerSp.isFetching)
  //    ) {
  //   return null
  // }

  return (
    <Row>
      <Col md={12} className="box">
        <div className="box-header with-border">
          <h3 className="box-title">Overall number of logins per SP</h3>
        </div>
        <Chart
          chartType="PieChart"
          data={sps ?? []}
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
                    var identifier = spsAr[selection[0].row]; 
                    goToSpecificProviderHandler(identifier[0], "sp")
                  }
                }
              }
            }
          ]}
        />
      </Col>
    </Row>
  );
}

export default LoginSpPieChart