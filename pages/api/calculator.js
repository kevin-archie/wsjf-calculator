import axios from "axios";
import {toast} from "react-toastify";

export let instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

async function httpRequest(
    method,
    url,
    request,
) {
    console.log("REQ:", request)
    const config = {
        method,
        url,
        data: request,
    };
    console.log("config", config)
    return instance.request(config)
        .then(response => response)
        .catch(error => {
            toast.error(error?.response?.data?.error, {position: "top-right"});
            return error?.response?.data;
        });
}

export default function post(id, components) {
    const payload = {
        id,
        components,
    };

    const url = process.env.CALCULATOR_URL;
    return httpRequest("post", url, payload);
}