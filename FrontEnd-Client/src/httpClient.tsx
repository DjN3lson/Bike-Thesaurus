import axios from "axios";

function httpClient() {
    return axios.create({
        withCredentials: true,
    });
}

export default httpClient;