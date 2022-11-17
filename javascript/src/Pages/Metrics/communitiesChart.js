import {useState, useContext, useEffect} from "react";
import { Chart } from "react-google-charts";import "../../app.css";
import {client} from '../../utils/api';
import {communitiesGroupBy} from "../../utils/queryKeys";
import {getCommunitiesGroupBy}  from "../../utils/queries";
import dateFormat from 'dateformat';
import {useQuery} from "react-query";
import Select from 'react-select';

export const options = {
    title: "Number of Communities created per Period",
    hAxis: {
        format: 'yyyy',
       
      }
};

const options_group_by = [
    { value: 'year', label: 'yearly' },
    { value: 'month', label: 'monthly' },
    { value: 'week', label: 'weekly' },
  ];

const CommunitiesChart =() => {
    const [selected, setSelected] = useState(options_group_by[0].value);

    const [communities, setCommunities] = useState();
    var communitiesArray = [["Date", "Communities"]];
    useEffect(() => {
        console.log(selected)
       // Get data for the last 4 years
       // TODO: change it to last 1 year
        client.get("communities_groupby/"+selected, { params: {'interval': 'year', 'count_interval':'4'}}).
        then(response => {
            console.log(response);
            response["data"].forEach(element => {     
                //var community = {"created":element.created, "name":element.community_info.name}
                
                var range_date = new Date(element.range_date);
                
                var community = [ range_date, element.count]
                communitiesArray.push(community)
                
            });
            console.log(communitiesArray)
            setCommunities(communitiesArray)
          })
        // 
        
    }, [selected])


    const handleChange = event => {
        console.log(event.value);
        setSelected(event.value);
    };

    return <div className="app">
    <h1>Communities</h1>
 
    <Chart chartType="ColumnChart" width="100%" height="400px" data={communities} 
        options={options} />
        Select Period:
        <Select options = {options_group_by} onChange={handleChange}></Select>
    </div>
}

export default CommunitiesChart