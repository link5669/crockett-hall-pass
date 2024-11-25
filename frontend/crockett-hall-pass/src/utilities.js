function getBackendURL() {
    if (process.env.REACT_APP_PRODUCTION == 'false') {
        return "http://localhost:5001"
    } else {
        return "https://crockett-hall-pass.vercel.app"
    }
}

export { getBackendURL }