import axios from "axios";
import {toast} from "react-toastify";

export let instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

async function httpRequest(
    url,
    request,
) {
    const config = {
        method: "post",
        url,
    };

    if (request?.params) {
        config.params = request.params;
    }

    if (request?.data) {
        config.data = request.data;
    }

    console.log("config", config)

    return instance.request(config)
        .then(response => response)
        .catch(error => {
            toast.error(error?.response?.data?.error, {position: "top-right"});
            throw error.message;
        });
}

function post(issueKey) {
    const url = process.env.JIRA_URL;
    const payload = {
        params: {
            method: "get",
            resource: "issue",
            issueKey
        },
    };

    return httpRequest(url, payload);
}

function getChildren(issueKey) {
    const url = process.env.JIRA_URL;
    const payload = {
        params: {
            method: "get",
            resource: "search",
            jql: `parent=\"${issueKey}\"&fields=summary`,
        }
    }
    return httpRequest(url, payload);
}

function updateTask(issueKey, wsjf_score) {
    const url = process.env.JIRA_URL;
    const payload = {
        params: {
            method: "put",
            resource: "issue",
            issueKey: issueKey,
            score: wsjf_score,
        }
    }
    return httpRequest(url, payload);
}

const jiraClient = {
    post,
    getChildren,
    updateTask,
};

export default jiraClient;