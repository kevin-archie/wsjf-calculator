import post from "./calculator";

const calculateInitiateTasks = async (task) => {
    const {
        id,
        issue_key,
        business_value,
        time_criticality,
        risk_opportunity,
        job_duration,
    } = task;

    const responseCalculateWSJF = await post(id, {
        issue_key,
        business_value,
        time_criticality,
        risk_opportunity,
        job_duration,
    });

    if(responseCalculateWSJF?.status === 200) {
        task.wsjf_score = responseCalculateWSJF.data.wsjf;
    }

    return task;
};

export default calculateInitiateTasks;