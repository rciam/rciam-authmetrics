import React, {useState, useEffect} from "react";
import {Chart} from "react-google-charts";
import {
  axisChartOptions,
  convertDateByGroup,
  getWeekNumber,
  parseDateFromISO
} from "../Common/utils";
import Select from 'react-select';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  regUsersOptions,
  options_group_by
} from "../../utils/helpers/enums";
import {useQuery, useQueryClient} from "react-query";
import {registeredUsersGroupByKey} from "../../utils/queryKeys";
import {getRegisteredUsersGroupBy} from "../../utils/queries";

const RegisteredUsersChart = ({
                                showActiveOnly,
                                tenenvId
                              }) => {
  const [selected, setSelected] = useState(options_group_by[0].value);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [global_options, setGlobalOptions] = useState();
  const queryClient = useQueryClient();

  let params = {
    params: {
      'interval': selected,
      'count_interval': regUsersOptions[selected]["count_interval"],
      'tenenv_id': tenenvId,
      'status': showActiveOnly ? 'A' : null,
    }
  }

  const registeredUsersGroup = useQuery(
    [registeredUsersGroupByKey, {groupBy: selected, params: params}],
    getRegisteredUsersGroupBy,
    {
      /*enabled: false, this caused problems of fetching data*/ 
      refetchOnWindowFocus: false
    }
  )

  useEffect(() => {
    const fetchData = async () => {
      params = {
        params: {
          'interval': selected,
          'count_interval': regUsersOptions[selected]["count_interval"],
          'tenenv_id': tenenvId,
          'status': showActiveOnly ? 'A' : null,
        }
      }

      try {
        const response = await queryClient.refetchQueries([registeredUsersGroupByKey, {groupBy: selected, params: params}])
      } catch (error) {
        // todo: Here we can handle any authentication or authorization errors
        console.error(RegisteredUsersChart.name + " error: " + error)
      }
    }
    fetchData();
  }, [selected, tenenvId, showActiveOnly])


  // Construct the data required for the datatable
  useEffect(() => {
    if (!registeredUsersGroup.isLoading
      && !registeredUsersGroup.isFetching
      && registeredUsersGroup.isSuccess
      && !!registeredUsersGroup.data) {

      const hticksArray = registeredUsersGroup?.data?.map(element => ({
          v: parseDateFromISO(element?.range_date),
          f: selected === "week" ? getWeekNumber(parseDateFromISO(element?.range_date)) : parseDateFromISO(element?.range_date)
        })
      )

      let fValues = [
        ['Date',
          'Count',
          {
            'type': 'string',
            'role': 'tooltip',
            'p': {'html': true}
          }
        ]
      ]

      const charData = registeredUsersGroup?.data?.map(element => ([
          parseDateFromISO(element?.range_date),
          parseInt(element['count']),
          `<div style="padding:5px 5px 5px 5px;">${convertDateByGroup(parseDateFromISO(element?.range_date), selected)}<br/>Users: ${parseInt(element['count'])}</div>`
        ])
      )

      setRegisteredUsers(fValues.concat(charData))
      setGlobalOptions(axisChartOptions(regUsersOptions[selected]["title"],
        regUsersOptions[selected]["hAxis"]["format"],
        hticksArray))
    }
  }, [!registeredUsersGroup.isLoading
  && !registeredUsersGroup.isFetching
  && registeredUsersGroup.isSuccess])

  // XXX Google Chart will not work if we return empty and then
  //     try to reload
  // if (registeredUsersGroup.isLoading
  //   || registeredUsersGroup.isFetching
  //   || registeredUsers?.length === 0) {
  //   return null
  // }

  return <Row className="box">
    <div className="box-header with-border">
      <h3 className="box-title">Number of Registered Users</h3>
    </div>
    <Col lg={12}>Select Period:
      <Select options={options_group_by}
              onChange={(event) => setSelected(event?.value)}/>
    </Col>
    <Col lg={12}>
      <Chart chartType="ColumnChart"
             width="100%"
             height="400px"
             loader={<div>Data loading</div>}
             data={registeredUsers}
             options={global_options}/>
    </Col>
  </Row>
}

export default RegisteredUsersChart