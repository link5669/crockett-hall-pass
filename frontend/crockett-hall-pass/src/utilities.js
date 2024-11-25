const inDev = false
function getBackendURL() {
    if (inDev) {
        return "http://localhost:5001"
    } else {
        return "https://crockett-hall-pass.vercel.app"
    }
}

export { getBackendURL }