import {getIdps, getSps} from "../../utils/queries";
import {idpsKey, spsKey} from "../../utils/queryKeys";
import {useQuery} from "react-query";
import Spinner from "./spinner";
import React from "react";

const DateRange = ({
  startDate,
  endDate,
  minDate,
  maxDate
}) => {
if(minDate == null || maxDate == null)
  return

return (
  <div>Number of Logins per Country from {startDate ? (
    `${startDate.toLocaleDateString("en-GB")} to ${endDate.toLocaleDateString("en-GB")}`
  ) : (
    `${minDate.toLocaleDateString("en-GB")} to ${maxDate.toLocaleDateString("en-GB")}`
  )}</div>
  )
}

export default DateRange