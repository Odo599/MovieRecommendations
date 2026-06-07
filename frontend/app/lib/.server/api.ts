import axios from "axios";

const backendApi = axios.create({
    baseURL: `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}`,
});

export default backendApi;
