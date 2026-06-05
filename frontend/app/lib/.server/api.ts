import axios from "axios";

const backendApi = axios.create({
    baseURL: "http://backend:3000",
});

export default backendApi;
