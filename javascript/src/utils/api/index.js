import axios from "axios"
import config from "./../../config_react.json";
const getConfig = key => config["configReact"][key]
console.log(getConfig('apiUrl'))
const client = axios.create({
  baseURL: getConfig('apiUrl'),
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-type": "application/json",
    // 'Authorization': `token ${access_token}`
  },
  transformResponse: [function (data) {
    try {
      // todo: Check for errors returned by the server
      return  JSON.parse(data)
    } catch (err) {
      return err
    }
  }],
})


export {
  client
}
