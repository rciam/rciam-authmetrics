import {useState, useContext, useEffect} from "react";
import "../../app.css";
import {client} from '../../utils/api';
import {communitiesGroupBy} from "../../utils/queryKeys";
import "jquery/dist/jquery.min.js";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import $ from "jquery";
import Datatable from "../../components/datatable";
import dateFormat from 'dateformat';

const CommunitiesDataTable =() => {
    const [communities, setCommunities] = useState();
    var communitiesArray = [];
    useEffect(() => {
        client.get("communities_groupby/month", {'groupBy': 'month'}).
        then(response => {
            console.log(response);
            response["data"].forEach(element => {     
                //var community = {"created":element.created, "name":element.community_info.name}
                
                var range_date = new Date(element.range_date);
                
                var community = { "Date": dateFormat(range_date, "yyyy-mm"), "Number of Communities": element.count, "Names": element.names}
                communitiesArray.push(community)
                
            });
            setCommunities(communitiesArray)
          })
        // 
        
    }, [])
    

    return <div className="app">
    <h1>Communities</h1>
    <Datatable items={communities}></Datatable>
    </div>

}

export default CommunitiesDataTable