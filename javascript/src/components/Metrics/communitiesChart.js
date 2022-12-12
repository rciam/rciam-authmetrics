import { useState, useContext, useEffect } from "react";
import { Chart } from "react-google-charts";
import "../../app.css";
import { client } from '../../utils/api';
import { communitiesGroupBy } from "../../utils/queryKeys";
import { getCommunitiesGroupBy } from "../../utils/queries";
import dateFormat from 'dateformat';
import { useQuery } from "react-query";
import Select from 'react-select';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListCommunities from "../listCommunities";

export const options = {
    year: {
        title: "Number of Communities created per year",
        hAxis: {
            format: 'Y',
        }
    },
    month: {
        title: "Number of Communities created per month",
        hAxis: {
            format: 'YYYY-MM',
        }
    },
    week: {
        title: "Number of Communities created per week",
        hAxis: {
            format: '',
        }
    }
};



const options_group_by = [
    { value: 'year', label: 'yearly' },
    { value: 'month', label: 'monthly' },
    { value: 'week', label: 'weekly' },
];

const CommunitiesChart = () => {

    const [selected, setSelected] = useState(options_group_by[0].value);
    const [communities, setCommunities] = useState();
    const [communitiesList, setcommunitiesList] = useState([]);
    var communitiesArray = [["Date", "Communities"]];
    var communitiesListArray = [];
    const [global_options, setGlobalOptions] = useState();

    useEffect(() => {

        console.log(options[selected]["hAxis"]["format"])
        var hticksArray = [];
        var fValues = [['Date', 'Count', { 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } }]]
        // Get data for the last 4 years
        // TODO: change it to last 1 year
        client.get("communities_groupby/" + selected, { params: { 'interval': 'year', 'count_interval': '4' } }).
            then(response => {
                console.log(response);

                response["data"].forEach(element => {
                    //var community = {"created":element.created, "name":element.community_info.name}
                    var range_date = new Date(element.range_date);
                    var community = [range_date, element.count]
                    communitiesArray.push(community)

                    // Construct the list with COUs
                    var createdDate = element.created_date.split(", ")
                    var description = element.description.split("|| ")
                    element.names.split("|| ").forEach(function (name, index) {
                        communitiesListArray.push({ name: name, created: createdDate[index], description: description[index] + '<br/>' + 'Created Date: ' + createdDate[index] })
                    })

                    if (selected == "week") {
                        hticksArray.push({ v: range_date, f: getWeekNumber(range_date) })
                    }
                    else {
                        hticksArray.push({ v: range_date, f: range_date })
                    }

                    // Construct element & tooltip
                    var temp = [];
                    temp.push(range_date);
                    temp.push(parseInt(element['count']));
                    temp.push('<div style="padding:5px 5px 5px 5px;">'
                        + convertDateByGroup(range_date, selected)
                        + "<br/> " + 'Communities'
                        + ": " + parseInt(element['count']) + '</div>');
                    fValues.push(temp);
                });

                // sort by value
                communitiesListArray = communitiesListArray.sort(function (a, b) {
                    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    // names must be equal
                    return 0;
                });
                //communitiesList.push({name:element.names, created: element.created_date, description: element.description})
                setcommunitiesList(communitiesListArray)
                //console.log(communitiesArray)
                setCommunities(fValues)


                setGlobalOptions({
                    title: options[selected]["title"],
                    backgroundColor: { fill: 'transparent' },
                    vAxis: {
                        //title: vAxisTitle[tab],
                        format: '0'
                    },
                    hAxis: {
                        format: options[selected]["hAxis"]["format"],
                        maxTextLines: 2,
                        //title: registeredUsersBy[type], // globar variable found at index.ctp
                        textStyle: { fontSize: 15 },
                        ticks: hticksArray,
                        //showTextEvery: 5
                    },
                    tooltip: { isHtml: true },
                    width: '100%',
                    height: '350',
                    bar: { groupWidth: "92%" },
                    legend: { position: "none" },
                })

            })

    }, [selected])

    function convertDateByGroup(jsDate, groupBy) {
        var month = (jsDate.getMonth() + 1).toString()
        if (month.length < 2) {
            month = '0' + month;
        }
        var day = jsDate.getDate().toString()
        if (day.length < 2) {
            day = '0' + day;
        }
        if (groupBy == 'daily') {
            var showDate = jsDate.getFullYear() + '-' + month + '-' + day;
        }
        else if (groupBy == 'week') {
            var showDate = jsDate.getFullYear() + '-' + month + '-' + day;
            var nextWeek = new Date(jsDate.setDate(jsDate.getDate() + 6));
            month = (nextWeek.getMonth() + 1).toString()
            if (month.length < 2) {
                month = '0' + month;
            }
            day = nextWeek.getDate().toString()
            if (day.length < 2) {
                day = '0' + day;
            }
            showDate += " to " + nextWeek.getFullYear() + '-' + month + '-' + day;
        }
        else if (groupBy == 'month') {
            var showDate = jsDate.getFullYear() + '-' + month;
        }
        else if (groupBy == 'year') {
            var showDate = jsDate.getFullYear();
        }
        return showDate;
    }

    function getWeekNumber(d) {
        
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        // Get first day of year
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        // Return array of year and week number
        return weekNo + ' (' + d.getUTCFullYear() + ')';
    }

    const handleChange = event => {
        console.log(event.value);
        setSelected(event.value);
    };

    return <Row>
                <Col lg={9}>
                    <Chart chartType="ColumnChart" width="100%" height="400px" data={communities}
                        options={global_options} />

                </Col>
                <Col lg={3}>
                    <Container>
                        <Row>

                            <Col lg={4}>Select Period:</Col>
                            <Col lg={8}>
                                <Select options={options_group_by} onChange={handleChange} ></Select>
                            </Col>

                        </Row>
                        <Row>
                            <Col lg={12}>

                                <ListCommunities communitiesList={communitiesList}></ListCommunities>

                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
        

}

export default CommunitiesChart