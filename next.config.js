module.exports = {
    reactStrictMode: true,
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        CALCULATOR_URL: process.env.NEXT_PUBLIC_CALCULATOR_URL,
        JIRA_URL: process.env.NEXT_PUBLIC_JIRA_URL,
    },
}
