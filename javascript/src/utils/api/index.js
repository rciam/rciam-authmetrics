import axios from "axios"

const client = axios.create({
  baseURL: "http://localhost:8004/",
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