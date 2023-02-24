import { useState, useContext, useEffect } from "react";
import { Chart } from "react-google-charts";
import { client } from '../../utils/api';
import Select from 'react-select';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import { convertDateByGroup, getWeekNumber } from "../Common/utils";

export const data = [
    ["Task", "Hours per Day"],
    ["Work", 11],
    ["Eat", 2],
    ["Commute", 2],
    ["Watch TV", 2],
    ["Sleep", 7],
];

export const options = {
    pieSliceText: 'value',
    width: '100%',
    height: '350',
    chartArea: {
        left: "3%",
        top: "3%",
        height: "94%",
        width: "94%"
    },
    sliceVisibilityThreshold: .005,
    tooltip: { isHtml: true, trigger: "selection" }
};
var idpsArray = [];
const LoginIdpPieChart = ({ setShowModalHandler, spIdentifier, tenantId }) => {
    const [idps, setIdps] = useState([["Identity Provider", "Identifier", "Logins"]]);
    var idpsChartArray = [["Identity Provider", "Logins"]];

    useEffect(() => {
        var params = { params: { tenant_id: tenantId } }
        if (spIdentifier) {
            params["params"]["sp"] = spIdentifier
        }
        client.get("logins_per_idp/", params).
            then(response => {
                console.log(response)
                response["data"].forEach(element => {
                    idpsChartArray.push([element.name, element.count])
                    idpsArray.push([element.name, element.entityid])
                })
                setIdps(idpsChartArray)
                console.log(idpsChartArray)
            })

    }, [])
    return (
        <Row>
            <Col md={12} className="box">
                <div className="box-header with-border">
                    <h3 className="box-title">Overall number of logins per IdP</h3>
                </div>
                <Chart
                    chartType="PieChart"
                    data={idps}
                    options={options}
                    width={"100%"}
                    height={"400px"}
                    className="pieChart"
                    chartEvents={[
                        {
                            eventName: "ready",
                            callback: ({ chartWrapper, google }) => {
                                const chart = chartWrapper.getChart();
                                // if(!managed){
                                //   console.log(managed)
                                //   setZerosIfNoDate(chartWrapper.getDataTable(), google)
                                // }

                                google.visualization.events.addListener(chart, 'click', selectHandler);
                                google.visualization.events.addListener(chart, 'onmouseover', showTooltip);
                                google.visualization.events.addListener(chart, 'onmouseout', hideTooltip);

                                function showTooltip(entry) {

                                    chart.setSelection([{ row: entry.row }]);
                                    $('.pieChart').css('cursor', 'pointer')
                                }
                                function hideTooltip() {

                                    chart.setSelection([]);
                                    $('.pieChart').css('cursor', 'default')
                                }
                                function selectHandler() {

                                    var selection = chart.getSelection();
                                    if (selection.length) {
                                        var identifier = idpsArray[selection[0].row];
                                        //var legend = data.getValue(selection[0].row, 0);
                                        console.log(selection[0])
                                        console.log(identifier)
                                        // Show Modal
                                        setShowModalHandler(true)
                                        // activeTab = $("ul.tabset_tabs li.ui-tabs-active").attr("aria-controls").replace("Tab","");
                                        // unique_logins = $("#myModal").is(':visible') ? $("#unique-logins-modal").is(":checked") : $("#unique-logins-"+activeTab).is(":checked");
                                        // goToSpecificProvider(identifier, legend, type, unique_logins);
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