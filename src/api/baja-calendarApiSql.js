import axios from "axios";
export const calendarApiSql = axios.create({
  baseURL: "http://localhost:5000",
});
