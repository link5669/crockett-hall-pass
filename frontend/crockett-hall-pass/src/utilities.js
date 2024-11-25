const inDev = true
function getBackendURL() {
    if (inDev) {
        return "localhost:5001"
    } else {
        return "https://crockett-hall-pass.vercel.app"
    }
}

export { getBackendURL }