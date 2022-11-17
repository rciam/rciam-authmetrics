import { useState, useContext, useEffect, Component } from "react";
import "jquery/dist/jquery.min.js";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import $ from "jquery";


class Datatable extends Component {

    componentDidMount() {
        if (!$.fn.DataTable.isDataTable("#myTable")) {
            $(document).ready(function () {
                setTimeout(function () {
                    $("#table").DataTable({
                        pagingType: "full_numbers",
                        pageLength: 20,
                        processing: true,
                        dom: "Bfrtip",
                        select: {
                            style: "single",
                        },

                        buttons: [
                            {
                                extend: "pageLength",
                                className: "btn btn-secondary bg-secondary",
                            },
                            {
                                extend: "copy",
                                className: "btn btn-secondary bg-secondary",
                            },
                            {
                                extend: "csv",
                                className: "btn btn-secondary bg-secondary",
                            },
                            {
                                extend: "print",
                                customize: function (win) {
                                    $(win.document.body).css("font-size", "10pt");
                                    $(win.document.body)
                                        .find("table")
                                        .addClass("compact")
                                        .css("font-size", "inherit");
                                },
                                className: "btn btn-secondary bg-secondary",
                            },
                        ],

                        fnRowCallback: function (
                            nRow,
                            aData,
                            iDisplayIndex,
                            iDisplayIndexFull
                        ) {
                            var index = iDisplayIndexFull + 1;
                            $("td:first", nRow).html(index);
                            return nRow;
                        },

                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "All"],
                        ],
                        columnDefs: [
                            {
                                targets: 0,
                                render: function (data, type, row, meta) {
                                    return type === "export" ? meta.row + 1 : data;
                                },
                            },
                        ],
                    });
                }, 1000);
            });
        }
    }

    listNames = (names, key) => {
        if (key == "Names" && typeof names === 'string') {
            return (
                <ul>
                    {  
                        names.split("||").map((name, keyIndex) => (
                            <li>{name}</li>
                        ))
                    }
                    
                </ul>
            )
        }
        else return (
            names
        )
        
    }

    showTable = (items) => {
        if(!items) return
        // try {
            return items.map((item, index) => {       
                
                return (
                    <tr className="test">
                        <td className="text-xs font-weight-bold">{index + 1}</td>
                        {
                            Object.keys(item).map((key, keyIndex) => 
                                
                                (
                                    
                                    <td className="text-xs font-weight-bold">
                                        {this.listNames(item[key], key)}
                                    </td>
                                )
                            )
                        }

                    </tr>
                );
            });
        // } catch (e) {
        //     //alert(e.message);
        // }
    };

    showColumns = (items) => {
        try {
            return (
                <tr>
                    <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">S/N</th>
                    {

                        Object.keys(items[0]).map((key, keyIndex) => (
                            <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">{key}</th>
                        ))
                    }
                </tr>
            )
        }
        catch (e) {
            //alert(e.message);
        }
    }
    render() {
        //console.log(items)
        return (
            <div className="container py-4">
                <div className="table-responsive p-0 pb-2">
                    <table id="table" className="table align-items-center justify-content-center mb-0">
                        <thead>
                            {this.showColumns(this.props.items)}
                        </thead>

                        <tbody>
                            {this.showTable(this.props.items)}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default Datatable;